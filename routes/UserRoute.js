require("dotenv").config();
require("../config/database").connect();

const { DOMAIN } = process.env
const { DOMAIN_API } = process.env

const express = require("express");
const userRouter = express.Router();
const Team = require("../schemas/TeamModel")
const User = require("../schemas/UserModel");
const Business = require("../schemas/BusniessModel")
const Restaurants = require("../schemas/RestaurantModel")
const auth = require("../middleware/auth");

var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mailer = require("../utils/mailer");

userRouter.post("/signup", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { firstName, lastName, email, password } = req.body;
    
    // Validate user input
    if (!(email && password && firstName && lastName)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      if (oldUser.firstName == " ") {
        try {
          // Create token
          const token = jwt.sign(
            { user_id: oldUser._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "10h",
            }
          );
          //Encrypt user password
          encryptedPassword = await bcrypt.hash(password, 10);
          // update user in our database
          await User.findByIdAndUpdate(
            oldUser._id,
            { firstName: firstName, lastName: lastName, email: email, password: encryptedPassword, token: token },
          );
          const updated_user = await User.findById(oldUser._id)
          
          // return new user
          res.status(201).json(updated_user);

        }
        catch (err) {
          res.status(500).send(JSON.stringify(err));
        }
      }
      else {
        return res.status(409).send("User Already Exist. Please Login");
      }
    }
    else {
      return res.status(409).send("Please confirm your email First ");
      // //Encrypt user password
      // encryptedPassword = await bcrypt.hash(password, 10);
      // // Create user in our database
      // const user = await User.create({
      //   firstName,
      //   lastName,
      //   email: email.toLowerCase(), // sanitize: convert email to lowercase
      //   password: encryptedPassword,
      // });

      // // Create token
      // const token = jwt.sign(
      //   { user_id: user._id, email },
      //   process.env.TOKEN_KEY,
      //   {
      //     expiresIn: "10h",
      //   }
      // );
      // // save user token
      // user.token = token;

      // // return new user
      // res.status(201).json(user);
    }
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
  // Our register logic ends here
});

// Login
userRouter.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user) {
      check = await bcrypt.compare(password, user.password)
      if (check) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
        // user
        res.status(200).json(user);
        return;
      }
    }
    const team = await Team.findOne({ email });
    if (team) {
      check = await bcrypt.compare(password, team.password)
      if (check) {
        // Create token
        const token = jwt.sign(
          { team_id: team._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        team.token = token;
        // user
        return res.status(200).json(team);

      }
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
  // Our register logic ends here
});

userRouter.post("/welcome", auth, (req, res) => {
  res.status(200).send("verified");
});

userRouter.post("/magicLink", async (req, res) => {
  const { email } = req.body;
  try {
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    const conformationCode = jwt.sign(
      { email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    if (oldUser) {
      if (oldUser.firstName == " ") {
        await User.findByIdAndUpdate(
          oldUser._id,
          {code: conformationCode},
        );
        mailer.sendConfirmationEmail(email, conformationCode);
        return res.status(200).send("Again Email sent succesfully");
      }
      return res.status(409).send("User Already Exist. Please Login");
    }
    // Create user in our database
    const user = await User.create({
      firstName: " ",
      lastName: " ",
      token: " ",
      code: conformationCode,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: " ",
    });


    await user.save();
    mailer.sendConfirmationEmail(email, conformationCode);
    res.status(200).send("Email sent succesfully");
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

//call when signup with google
userRouter.post("/googlesignup", async (req, res) => {
  const { email } = req.body;
  try {
    // Validate user input
    if (!(email)) {
      return res.status(400).send("Email Requried");
    }
    const oldUser = await User.findOne({ email });
    const conformationCode = jwt.sign(
      { email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    if (oldUser) {
      if (oldUser.firstName == " ") {
        await User.findByIdAndUpdate(
          oldUser._id,
          { firstName: " ", lastName: " ", email: email.toLowerCase(), password: " ", token: " ", code: oldUser.code },
        );
        return res.status(200).send("User Updated with Empty info");
      }
      return res.status(409).send("User Already Exist. Please Login");
    }
    const user = await User.create({
      firstName: " ",
      lastName: " ",
      token: " ",
      code: conformationCode,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: " ",
    });


    await user.save();
    res.status(200).send("User Created with Empty info");
  }
  catch (err) {
    res.status(500).send(JSON.stringify(err));
  }

})

userRouter.get("/confirm/:code", async (req, res) => {

  let code = req.params.code;
  console.log(code)
  const user = await User.findOne({ "code": code });
  if (user) {
    if (user.code == code) {

      res.redirect("http://" + DOMAIN + "/signupinfo/");
    }
  }
  else {
    res.send("Invalid Page to Redirected");;
  }
});

userRouter.post("/registerbusiness", async (req, res) => {
  // to register business
  const { businessName, phone, street, city, state, postal, userId } = req.body
  try {

    // Validate user input
    if (!(businessName && phone && street && city && postal && userId)) {
      return res.status(400).send("All input is required");
    }
    // check if any business already associate with "UserID"
    const oldbusiness = await Business.findOne({ "userId": userId });
    if (oldbusiness) {
      return res.status(409).send("Already a Business Associated with this User.");
    }
    // Check Phone no Already exists 
    phone_check = await Business.findOne({ "phone": phone });
    if (phone_check) {
      return res.status(409).send("Phone Already Exists it must be unique");
    }

    const temp_Business = new Business({
      businessName: businessName,
      phone: phone,
      street: street,
      city: city,
      state: state,
      postal: postal,
      userId: userId
    })
    await temp_Business.save();
    res.status(200).send("Business succesfully Saved");

  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
})

userRouter.post("/registerrestaurants", async (req, res) => {
  // to register business
 
  const { logo, background, currency, vatNum, slug, categories, userId, bio } = req.body
  try {
    // Validate user input
    if (!(logo && background && currency && vatNum && slug && userId)) {
      return res.status(400).send("All input is required");
    }

    // // check if any  Restaurant already associate with "UserID"
    // const oldrestaurant = await Restaurants.findOne({ "userId": userId });
    // if (oldrestaurant) {
    //   return res.status(409).send("Already a Restaurants Associated with this User.");
    // }

    const slug_check = await Restaurants.findOne({ "slug": slug });
    if (slug_check) {
      return res.status(409).send("Restaurant already Exists Slug/Name must be unique");
    }

    const restaurants = await Restaurants.create({
      logo: logo,
      background: background,
      currency: currency,
      vatNum: vatNum,
      slug: slug,
      categories: categories,
      bio: bio,
      userId: userId
    })
    await restaurants.save();
    res.status(200).send("Restaurants succesfully Saved");

  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
})

//User ForgotPassword Api
//send a email if user_eamil exist in database
userRouter.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email is valid
    if (!email) {
      return res.status(400).send('Email is required');
    }
    //conformationCode sent with email magicLink
    const conformationCode = jwt.sign(
      { email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      const oldteammember = await Team.findOne({ email });
      if (!oldteammember) {
        return res.status(404).send('User/Team Member Not Exist');
      }
      else {
        if (oldteammember.name == " ") {
          return res.status(404).send('Team Member Not Exist');
        }
        await Team.findByIdAndUpdate(
          oldteammember._id,
          { forgotpasswordcode: conformationCode },
        );
        mailer.sendForgotPasswordEmail(email, conformationCode);
        return res.status(200).send("Email sent succesfully");
      }

    }
    if (oldUser.firstName == " ") {
      return res.status(404).send('User Not Exist');
    }
    await User.findByIdAndUpdate(
      oldUser._id,
      { forgotpasswordcode: conformationCode },
    );

    mailer.sendForgotPasswordEmail(email, conformationCode);
    res.status(200).send("Email sent succesfully");
  } catch (err) {
    res.status(500).send(JSON.stringify(err))
  }
})

//User ResetPassword Api
userRouter.post("/resetpassword", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the email is valid
    if (!password) {
      return res.status(400).send('Password is required');
    }
    newencryptedPassword = await bcrypt.hash(password, 10);
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      const oldteammember = await Team.findOne({ email });
      if (oldteammember) {
        await Team.findByIdAndUpdate(
          oldteammember._id,
          { password: newencryptedPassword },
        )
        //return updated User
        updatedteammember = await Team.findOne({ email })
        res.status(200).send(updatedteammember);
      }
      return res.status(404).send('User/Team Member Not Exist');
    }

    //find user and update one
    await User.findByIdAndUpdate(
      oldUser._id,
      { password: newencryptedPassword },
    )
    //return updated User
    updated_user = await User.findOne({ email })
    res.status(200).send(updated_user);
  }
  catch (err) {
    res.status(500).send(JSON.stringify(err))
  }

})

userRouter.get("/forgotpassword/confirm/:code", async (req, res) => {

  let code = req.params.code;
  const user = await User.findOne({ "forgotpasswordcode": code });
  if (user) {
    if (user.forgotpasswordcode == code) {
      return res.redirect("http://" + DOMAIN + "/resetpassword/" + user.email);
    }
  }
  else {
    const team = await Team.findOne({ "forgotpasswordcode": code });
    if (team) {
      if (team.forgotpasswordcode == code) {
        return res.redirect("http://" + DOMAIN + "/resetpassword/" + team.email);
      }
    }
    res.send("Invalid Page to Redirected");
  }

});

userRouter.post("/googlesignin", async (req, res) => {
  try {
    const { email } = req.body;
    // Validate user input
    if (!(email)) {
      return res.status(400).send("Email required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (user) {
      if (user.firstName != " ") {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
        // user
        res.status(200).json(user);
        return;
      }
    }
    const team = await Team.findOne({ email });
    if (team) {
      if (team.name != " ") {
        // Create token
        const token = jwt.sign(
          { team_id: team._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        team.token = token;
        // user
        res.status(200).json(team);
        return;
      }
    }
    res.status(400).send("Invalid User");
  }catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
})

userRouter.post('/getallrestaurant' , async (req, res) => {
  try{
  
  uid=req.body.userId
  all_restaurant=await Restaurants.find({ "userId": uid });

  if(all_restaurant.length ==0){
    return res.status(200).send(JSON.stringify("No Restaurant Found"))
  }
  return res.status(200).json(all_restaurant);
  }catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
                         
})
module.exports = userRouter;