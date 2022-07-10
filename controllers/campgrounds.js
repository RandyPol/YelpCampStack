// Getting the model that we create from the origional Schema 
const Campground = require("../models/campground")

//Creating a wrapper function to handle our ASYNC routes ERRORHandling
//This allow us to forgo the use of try&catch methods while dealing with ASYNC functions
const catchAsync = require('../utils/catchAsync')

// List of states
const stateList = require("../seeds/stateList")

////////CRUD: => INDEX  
module.exports.index = catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })

})

////////CRUD: => New   
module.exports.getNewCampground = (req, res) => {
    res.render("campgrounds/new", { stateList })
}

////////CRUD: => Create 
module.exports.postNewCampground = catchAsync(async (req, res, next) => {
    // console.log(_.isEmpty(req.body.title))
    // if (_.isEmpty(req.body)) throw new ExpressError("Cannot Submit Empty Form", 400)
    const { title, price, city, state, description, image } = req.body;
    const location = `${city}, ${state}`;
    const newCamp = new Campground({ title, price, location, description, image });
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${newCamp._id}`);
})

////////CRUD: => SHOW   
module.exports.showCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(camp)
    res.render('campgrounds/show', { camp })
})


////////CRUD: => EDIT  
module.exports.editCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', "Campground doesn't exits");
        return res.redirect("/campgrounds")
    }
    res.render('campgrounds/edit', { camp, stateList })
})


////////CRUD: => UPDATE  
module.exports.updateCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, price, city, state, description } = req.body;
    // console.log("Checking before updating")
    // const camp1 = await Campground.findById(id);
    // console.log(camp1)
    const camp = await Campground.findByIdAndUpdate(id, {
        title: title,
        price: price,
        description: description,
        location: `${city}, ${state}`
    }, { new: true })
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${camp._id}`);

})



////////CRUD: => DELETE
module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground');
    res.redirect('/campgrounds');
})