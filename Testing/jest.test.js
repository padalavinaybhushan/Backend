


const {server }= require("../server")

const request = require("supertest")




describe("/candiate", () => {

    describe("/clogin.html", () => {

        test("cand login with right crendentials", async () => {

            const response = await request(server).post("/clogin.html").send({
                email:"vinay.p@darwinbox.io",
                password:"123"
            })
            expect(response.body.okay).toEqual(true)

        })
        test("cand login email empty", async () => {

            const response = await request(server).post("/clogin.html").send({
                email:"",
                password:"123"
            })
            expect(response.body.okay).toEqual(false)

        })
        test("cand login password empty", async () => {

            const response = await request(server).post("/clogin.html").send({
                email:"vinay.p@darwinbox.io",
                password:""
            })
            expect(response.body.okay).toEqual(false)

        })
        test("cand login both empty", async () => {

            const response = await request(server).post("/clogin.html").send({
                email:"",
                password:""
            })
            expect(response.body.okay).toEqual(false)

        })
        test("cand login with wrong crendentials", async () => {

            const response = await request(server).post("/clogin.html").send({
                email:"vinay.p@darwinbox.io",
                password:"1234"
            })
            expect(response.body.okay).toEqual(false)

        })

    })
    describe("/job-del", () => {
        test("cand del job  with right details", async () => {

            const response = await request(server).post("/job-del").send({
                cand_id:"6415a87528d4bfdbe585b828",
                job_id:"64180a13c8fb37e97ccb5e8a"
            })
            expect(response.body.okay).toEqual("success")

        })
    })

})








