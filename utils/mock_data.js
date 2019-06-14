const faker = require('faker');


const info = [
    randomName = faker.name.findName(),
    randomEmail = faker.internet.email(), 
    randomUserName = faker.internet.userName(),
    randomPhone = faker.phone.phoneNumber(),
    randomAddress = {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode()
    }
]

let barbacks = [];
for(let i = 0; i < 3; i++) {
    barbacks.push(info);
}
let bartenders = [];
for(let i = 0; i < 3; i++) {
    bartenders.push(info);
}
let bussers = [];
for(let i = 0; i < 4; i++) {
    bussers.push(info);
}
let runners = [];
for(let i = 0; i < 4; i++) {
    runners.push(info);
}
let servers = [];
for(let i = 0; i < 6; i++) {
    servers.push(info);
}
let managers = [];
for(let i = 0; i < 2; i++) {
    managers.push(info);
}
let hosts = [];
for(let i = 0; i < 3; i++) {
    hosts.push(info);
}
let maitre_d = [];
for(let i = 0; i < 1; i++) {
    maitre_d.push(info);
}
let captains = [];
for(let i = 0; i < 2; i++) {
    captains.push(info);
}

const data = [{ barbacks }, { bartenders}, {bussers}, {runners}, {servers}, {managers}, {hosts}, {maitre_d}, {captains}]
module.exports = { data }