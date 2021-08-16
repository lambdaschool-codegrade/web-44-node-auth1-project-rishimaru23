const Users = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
  function restricted( req, res, next) {
    if(req.session.user) {
      next()
    } else {
      next({ status: 401, message: "You shall not past!"})
    }
  }


/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  if(req.body.username) {
    try {
      const username = req.body.username || null
      const [user] = await Users.findBy({ username })
      if(!user){
        next()
      } else if(user.username === username) {
        next({ status: 422, message: 'Username taken' })
      } else {
        next()
      }
    } catch(err) {
      next(err)
    }
  } else {
    next({ status: 401, message: 'please provide a username'})
  }
}
/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req,res,next) {
  if(req.body.username){
    try {
      const username = req.body.username
      const [user] = await Users.findBy({ username })
      if(!user) {
        next({ status: 400, message: 'Invalid credentials'})
      } else {
        req.user = user
        next()
      }
    } catch(err) {
      next(err)    
    }
  } else {
    next({ status: 400, message: 'please provide a username' })
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  if(!req.body.password || req.body.password.length <= 3) {
    next({ status: 422, message: 'Password must be longer than 3 chars' })
  } else {
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}