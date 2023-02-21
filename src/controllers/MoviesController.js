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

    return response.json()
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

  async delete(request, response) {
    const { id } = request.params

    await knex("movies").where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { title, user_id, tags } = request.query

    let movies

    if(tags) {
      const filterTags = tags.split(",").map(tag => tag.trim())

      movies = await knex("tags")
      .select([
        "movies.id",
        "movies.title",
        "movies.user_id"
      ])
      .where("movies.user_id", user_id)
      .whereLike("title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("movies", "movies.id", "tags.movie_id")
      .orderBy("movies.title")

    } else {
      movies = await knex("movies")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title")

    }

    const userTags = await knex("tags").where({ user_id })

    const moviesWithTags = movies.map(movie => {
      const movieTags = userTags.filter(tag => tag.movie_id === movie.id)

      return {
        ...movie,
        tags: movieTags
      }
    })

    return response.json(moviesWithTags)
  }
}

module.exports = MoviesController