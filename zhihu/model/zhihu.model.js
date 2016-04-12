var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ZhihuSchema = new Schema({
	date: {
		type: String,
		default: null
	},
	question_title: {
		type: String,
		default: null
	},
	question_link: {
		type: String,
		default: null
	},
	author: {
		type: String,
		default: null
	},
	author_link: {
		type: String,
		default: null
	},
	vote: {
		type: String,
		default: null
	},
	answer: {
		type: String,
		default: null
	},
	answer_link: {
		type: String,
		default: null
	},
    data_time: {
        type: Number,
        default: -1
    },
    author_avatar:{
        type: String,
        default: null
    }
});


mongoose.model('Zhihu', ZhihuSchema);