const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { body } = request
  if ((!body.title) || (!body.url)) {
    return response.status(400).end()
  }

  // console.log(request.token)
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //  return response.status(401).json({ error: 'token invalid' })
  // }
  // console.log(decodedToken)
  // reques.user
  // const user = await User.findById(decodedToken.id)
  const { user } = request

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })
  const savedBlog = await blog.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(populatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { id } = request.params
  const { comment } = request.body

  if (!comment) {
    return response.status(400).json({ error: 'Comment content missing' })
  }

  // Find the blog by ID
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  // Add the new comment to the blog's comments array
  blog.comments = blog.comments.concat(comment)

  // Save the updated blog
  const updatedBlog = await blog.save()

  response.status(201).json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  // console.log(decodedToken.id.toString(), blog.user.toString())
  if ((request.user)) {
    const blogToDelete = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).end()
  }
})
// && ( blog.user.toString() === request.user.id.toString())

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1 })
  if (updatedBlog) {
    response.status(200).json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
