/**
 * @param article String
 * @param keywords Array
 */
function statistics(articles, keywords) {
    var frequency = {}
        , alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (var i = 0; i < keywords.length; i++) {
        frequency[keywords[i]] = 0;
    }
    var word = [];
    for (var i = 0; i < articles.length; i++) {
        if (alphabet.indexOf(articles[i]) != -1) {
            if (i == 0 || alphabet.indexOf(articles[i - 1]) == -1) {
                word.length = 0;
                word.push(articles[i]);
            } else {
                word.push(articles[i]);
            }
        } else {
            if (word.length && frequency[word.join("")] != undefined) {
                frequency[word.join("")]++;
                word.length = 0;
            }
        }
    }

    if (word.length && frequency[word.join("")] != undefined) {
        frequency[word.join("")]++;
        word.length = 0;
    }

    return frequency;
}