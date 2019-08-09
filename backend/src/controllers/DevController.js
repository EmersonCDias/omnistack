const axios = require('axios')
const Dev = require('../models/Dev')

module.exports = {
  async index(req, res) {
    const { user } = req.headers

    const loggedDev = await Dev.findById(user)

    const users = await Dev.find({
      $and: [
        // Fetch all users but the logged one (ne = not equal)
        { _id: { $ne: user } },
        // Exclude all users that the user have already liked (nin = not in)
        { _id: { $nin: loggedDev.likes } },
        // Exclude all users that the user have not already liked (nin = not in)
        { _id: { $nin: loggedDev.dislikes } },
      ]
    })

    return res.json(users)
  },

  async store(req, res) {
    // The user is sending this info
    const { username } = req.body

    const userExists = await Dev.findOne({ user: username })

    if (userExists) {
      return res.json(userExists)
    }

    // Get user information
    const response = await axios.get(`https://api.github.com/users/${username}`)

    console.log('response', response.data)

    // Payload
    const { name, bio, avatar_url } = response.data

    // Save user information
    const dev = await Dev.create({
      name,
      user: username,
      avatar: avatar_url,
      bio,
    })

    return res.json(dev)
  }
}
