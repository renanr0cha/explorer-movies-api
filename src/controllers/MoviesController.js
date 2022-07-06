const knex = require("../database/knex")

class MoviesController {
  async create(request, response) {
    const { title, description, tags, rating } = request.body
    const { user_id } = request.params

    const movie_id = await knex("movies").insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map(name => {
      return {
        movie_id,
        user_id,
        name
      }
    })

    await knex("tags").insert(tagsInsert)

    response.json()
  }

  async show(request, response) {
    const { id } = request.params
    const note = await knex("movies").where({ id }).first()
    const tags = await knex("tags").where({ movie_id: id}).orderBy("name")

    return response.json({
      ...note,
      tags
    })
  }
}

module.exports = MoviesController