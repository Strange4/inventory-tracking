import supertest from 'supertest';
import { app } from '../../src/app';

describe('api testing', ()=>{
    describe('items route', ()=>{
        let server:any, agent:supertest.SuperAgentTest;
        beforeEach((done)=>{
            const port = 5000;
            server = app.listen(port)
            agent = supertest.agent(server);
            done();
        });
        afterEach(()=>{
            server?.close();
        });
        describe('get requests', ()=>{
            it('should return 404 on server init', async ()=>{
                const result = await agent.get('/api/items');
                expect(result.statusCode).toBe(404);
            });
            it('should have the the items after sending a post request', async ()=>{
                const myObj = {name: "my name is slim shady", quantity:0};
                await agent.post('/api/items').send(myObj);
                const response = await agent.get('/api/items');
                expect(response.body)
                .toMatchObject([{content: myObj}]);
                expect(response.body[0]).toHaveProperty('id');
            });
        });
        describe('post requests', ()=>{
            it('should respond with 422 when the wrong data is being sent', ()=>{
                agent.post('/api/items')
                .send({noname: "not a name"})
                .expect(422);

                agent.post('/api/items')
                .send({description: "my description"})
                .expect(422);
            });
            it('should return a message when a post request is wrong', async ()=>{
                const response = await agent.post('/api/items').send({noname: "not a name"})
                expect(response.body).toBeDefined();
            })
            it('should return the object with an id when a good post request is sent', async ()=>{
                const myObj = {name: "i have a name", description: "i have a description", quantity: 10};
                const result = await agent.post('/api/items').send(myObj);
                expect(result.statusCode).toBe(201);
                expect(result.body)
                .toMatchObject({ content: myObj});
                expect(result.body).toHaveProperty('id');
    
            })
        });
        describe('delete requests', ()=>{
            
        })
    });
});