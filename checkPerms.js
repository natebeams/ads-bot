const config = require('./permissions');

module.exports = function(member, command){

console.log("COMMAND:", command);
console.log("USER ROLES:", member.roles.cache.map(r => r.id));

// FULL ACCESS ROLES
const fullAccess = [
config.roles.STAFF_MANAGER,
config.roles.SERVER_MANAGER,
config.roles.CO_OWNER,
config.roles.OWNER
];

for(const roleID of fullAccess){
if(member.roles.cache.has(roleID)){
console.log("FULL ACCESS ROLE DETECTED");
return true;
}
}

const allowedRoles = config.permissions[command];
console.log("ALLOWED ROLES:", allowedRoles);

if(!allowedRoles) return true;

for(const roleName of allowedRoles){

const roleID = config.roles[roleName];
console.log("CHECKING ROLE:", roleName, roleID);

if(member.roles.cache.has(roleID)){
console.log("PERMISSION GRANTED");
return true;
}

}

console.log("PERMISSION DENIED");
return false;

}