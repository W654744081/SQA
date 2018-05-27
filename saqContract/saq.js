"use strict";

var BaiKeItem = function(text) {
    if (text) {
        var entity = JSON.parse(text);
        this.title = entity.title;
        this.lemmaSummary = entity.lemmaSummary;
        this.author = entity.author; 
        this.detailDesc = entity.detailDesc;
    } else {
        this.title = "";
        this.lemmaSummary = "";
        this.author = "";
        this.detailDesc = "";
    }
};

BaiKeItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var BaikeDictionary = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new BaiKeItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

BaikeDictionary.prototype = {
    init: function () {
        // todo
    },

    save: function (title, lemmaSummary, detailDesc) {

        title = title.trim();
        lemmaSummary = lemmaSummary.trim();
        detailDesc = detailDesc.trim();
        if (title === "" || lemmaSummary === ""){
            throw new Error("for baike item,title and lemmaSummary must not null");
        }
        if (lemmaSummary.length < 5 || title.length < 3){
            throw new Error("title / lemmaSummary exceed limit length")
        }
        if (detailDesc != ""){
            if (detailDesc.length < 15){
                throw new Error("detailDesc length must greate 15 ")
            }
        }
        var from = Blockchain.transaction.from;
        var baiKeItem = this.repo.get(title);
        if (baiKeItem){
            throw new Error("this baike is create by other person");
        }

        BaiKeItem = new BaiKeItem();
        BaiKeItem.author = from;
        BaiKeItem.title = title;
        BaiKeItem.lemmaSummary = lemmaSummary;
        BaiKeItem.detailDesc = detailDesc;
        this.repo.put(title, BaiKeItem);
    },

    get: function (title) {
        title = title.trim();
        if ( title === "" ) {
            throw new Error("this baike item not exist,you can create it")
        }
        return this.repo.get(title);
    }
};
module.exports = BaikeDictionary;