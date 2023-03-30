require("dotenv").config();
require("../config/database").connect();

const express = require("express");
const teamRouter = express.Router();

const Team = require("../schemas/TeamModel")
const User = require("../schemas/UserModel");
const auth = require("../middleware/auth");

var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mailer = require("../utils/mailer");
const { response } = require("express");


teamRouter.post("/signup", async (req, res) => {
    try {
        // Get user input
        const { name, surname, email, password, image} = req.body;
        // Validate user input
        //image also required
        if (!(email && password && name && surname )) {
            return res.status(400).send("All input is required");
        }
        // check if user already exist
        // Validate if user exist in our database
        const oldTeam = await Team.findOne({ email });
        if (oldTeam) {
            if (oldTeam.name == " ") {
                try {
                    // Create token
                    const token = jwt.sign(
                        { team_id: oldTeam._id, email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "10h",
                        }
                    );
                    //Encrypt user password
                    encryptedPassword = await bcrypt.hash(password, 10);
                    // update user in our database
                    await Team.findByIdAndUpdate(
                        oldTeam._id,
                        { name: name, surname: surname, email: email, password: encryptedPassword, token: token, image: image },
                    );
                    const updated_team = await Team.findById(oldTeam._id)
                    // return new user
                    return res.status(200).json(updated_team);

                }
                catch (err) {
                    return res.status(500).send(JSON.stringify(err));
                }
            }
            else {
                return res.status(409).send("User Already Exists. Please Login");
            }

        }
        else {
            return res.status(409).send("Please confirm your email First ");
        }
        // //Encrypt user password
        // encryptedPassword = await bcrypt.hash(password, 10);
        // // Create user in our database
        // const team = await Team.create({
        //     name: name,
        //     surname: surname,
        //     email: email.toLowerCase(), // sanitize: convert email to lowercase
        //     password: encryptedPassword,
        //     image: image,
        //     role: role
        // });

        // // Create token
        // const token = jwt.sign(
        //     { team_id: team._id, email },
        //     process.env.TOKEN_KEY,
        //     {
        //         expiresIn: "10h",
        //     }
        // );
        // // save user token
        // team.token = token;

        // // return new user
        // res.status(201).json(team);
    }
    catch (err) {
        res.status(500).send(JSON.stringify(err));
    }


})
//send Invites to Team Member
teamRouter.post("/sendinvites", async (req, res) => {
    //At the the time of team member invitation we set userid to ref which user is sent invites ad set restaurantId for restaurant ref
    const { team_members, userId } = req.body;
    leng = team_members.length
    all_response = []
    //loop Over member array
    for (let i = 0; i < leng; i++) {
       
        member = team_members[i]
        email = member.email //get email
        role = member.role //get role
        userid=userId
        resid=restaurantId
        //check all the Email and Role field Filled 
        if (!(email && role)) {
            all_response.push({ "Massage": "All input is required", "code": "400", "email": email, "Role": role });
            continue;
        }
        //check a user cannot be a team member
        let oldUser =await User.findOne({ "email": email });
        if(oldUser){
            all_response.push({ "Massage": "A user can not be a team member", "code": "400", "email": email, "Role": role });
            continue;
        }

        // jwt Code 
        const conformationCode = jwt.sign(
            { email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "24h",
            }
        );

        // check if user already exist
        // Validate if user exist in our database
        const oldTeamMember = await Team.findOne({ "email": email });
        if (oldTeamMember) {
            //if User Exist with empty Name then send email again
            if (oldTeamMember.name == " ") {
                await  Team.findByIdAndUpdate(
                    oldTeamMember._id,
                    {code: conformationCode},
                  )
                await mailer.sendConfirmationEmail(email, conformationCode);
                all_response.push({ "Massage": "Email sent Again succesfully", "code": "200", "email": email, "Role": role });
                continue;
            }
            //if User Exist and information filled then 
            all_response.push({ "Massage": "Team Member Already Exist. Please Login", "code": "409", "email": email, "Role": role });
            continue;
            
        }
       
        // Create Team Member in our database
        let team = await Team.create({
            name: " ",
            surname: " ",
            token: " ",
            code: conformationCode,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: " ",
            role: role.toLowerCase(),
            image: " ",
            userId: userid,
        });
        await team.save();
        await mailer.sendConfirmationEmail(email, conformationCode);
        all_response.push({ "Massage": "Email sent succesfully", "code": "200", "email": email, "Role": role });
    }
    try {
        res.status(200).send(all_response);
    }
    catch (err) {
        res.status(424).send('Failed Dependency');
    }

})

//forgotpassword
teamRouter.post("/forgotpassword", async (req, res) => {
    const { email } = req.body;
    console.log("forgot", email)
    try {
        // Check if the email is valid
        if (!email) {
            return res.status(400).send('Email is required');
        }
        // check if user already exist
        // Validate if user exist in our database
        const oldteammember = await Team.findOne({ email });
        if (!oldteammember) {
            return res.status(404).send('Team Member Not Exist');
        }
        const conformationCode = jwt.sign(
            { email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        mailer.sendForgotPasswordEmail(email, conformationCode);
        res.status(200).send("Email sent succesfully");
    } catch (err) {
        res.status(500).send(JSON.stringify(err))
    }
})

//User ResetPassword Api
teamRouter.post("/resetpassword", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the email is valid
        if (!password) {
            return res.status(400).send('Password is required');
        }
        // check if Team Member already exist
        // Validate if Team Member exist in our database
        const oldteammember = await Team.findOne({ email });
        if (!oldteammember) {
            return res.status(404).send('Team Member Not Exist');
        }
        newencryptedPassword = await bcrypt.hash(password, 10);
        //find Team Member and update one
        await Team.findByIdAndUpdate(
            oldteammember._id,
            { password: newencryptedPassword },
        )
        //return updated User
        updated_team = await Team.findOne({ email })
        res.status(200).send(updated_team);
    }
    catch (err) {
        res.status(500).send(JSON.stringify(err))
    }

})

module.exports = teamRouter;