const request = require("supertest");
// const server = require("../index.js");
// import server from "../index.js"
// import request from "supertest";

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})
// describe('Welcome', () => {
//   it('Check for application url execution', () => {
//     const res = request(server)
//       .get('/api/welcome')
//       .send()
//     expect(res.statusCode).toEqual(200)
//     expect(res.body).toBe('Hello!! Welcome to the Ecommerce App')
//   })
// })