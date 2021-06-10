# In this version 'app.js' has been refactored into a seperate '/routes' directory and authorization has been added to update and delete the campground and author of the comment and campground are synced with the currentUser.


# schema -> author: String -> author: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    username: String
}

# /routes/comments.js -->  router.post("/", function(req, res){ -->

    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    comment.save();
                    