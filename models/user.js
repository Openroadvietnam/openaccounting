var crypto   = require('crypto');
var userSchema = new Schema({
	local:{
		email		 : {type:String,lowercase:true},
		password	 : String,
		rspassword	 : String,
		name  		 : String,
		picture		 : String,
		address		 : String,
		phone		 : String,
		company		 : String,
		token        : String,
		active		 : {type:Boolean,default:false},
		key        	 : String
	},
	google           : {
        id           : String,
        token        : String,
        email        : {type:String,lowercase:true},
        name         : String,
		refreshToken : String,
		picture		 : String
    },
	facebook         : {
        id           : String,
        token        : String,
        email        : {type:String,lowercase:true},
        name         : String,
		refreshToken : String,
		picture		 : String
    },
	current_id_app:String,
	current_user:String,
	email        : {type:String,lowercase:true},
    name         : String,
	picture		 : String,
	token        : String,
	tokens       : [String],
	refreshToken : String,
	server		 : String,
	join_date	 :{type:Date,default:Date.now}
});
userSchema.methods.generateHash = function(password) {
    return crypto.createHash('md5').update(password).digest('hex');
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	var c = crypto.createHash('md5').update(password).digest('hex');
    return (c==this.local.password);
};
userSchema.methods.validRspassword = function(password) {
	var c = crypto.createHash('md5').update(password).digest('hex');
    return (c==this.local.rspassword);
};

module.exports = mongoose.model("user",userSchema);