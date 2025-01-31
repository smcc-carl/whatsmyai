module.exports = function(eleventyConfig) {

   eleventyConfig.addPassthroughCopy("./src/assets");
   eleventyConfig.addPassthroughCopy("./src/main.js");

//random
eleventyConfig.addFilter("random", function(collection, count) {
    // Fisher-Yates shuffle algorithm
    const shuffled = [...collection];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return count ? shuffled.slice(0, count) : shuffled;
});

//search
eleventyConfig.addCollection("aiTools", function (collectionApi) {
    return collectionApi.getFilteredByGlob("ai/*.md");
});


    return{
        dir:{
            input:"src",
            output:"public"
        }
    }
}