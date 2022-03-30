'use strict';
const paths = require("path");
const fs = require("fs");
const fse = require('fs-extra');
const { set, get, unset } = require("lodash");
const ErrorShow = require("./error.js");

class multipleCreate {
    constructor(path = "datas.json", maxlimit = 0) {
        if(!path || (isNaN(maxlimit))) throw new ErrorShow("Multiple Creating Settings Problem");
      
        this.path = paths.join(process.cwd(), path);

        if(!String(this.path).endsWith(".json")) throw new ErrorShow("End With .json Data Json File");
        if(!fs.existsSync(this.path)) {
            fse.outputFileSync(this.path, "{}")
        }

        this.toJSON = function(limit) {
            const allData = this.all(limit);
            const json = {};
            for (const element of allData) {
                json[element.ID] = element.data;
            }
            return json;
        }

        this.set = function(key, value) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null) throw new ErrorShow("Unapproved value");
            if(maxlimit != 0 && this.size() >= maxlimit) throw new ErrorShow("Data limit exceeded");
            let jsonData = this.toJSON();
            set(jsonData, key, value);
            fs.writeFileSync(this.path, JSON.stringify(jsonData, null, 4));
            return value;
        }

        this.add = function(key, value) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            if (value === "" || value === undefined || value === null || isNaN(Number(value))) throw new ErrorShow("Unapproved value");
            let data = Number(this.get(key)) || 0;
            if(data == null) return false;
            if (isNaN(data)) throw new ErrorShow("Unapproved value");
            let res = (data + Number(value))
            this.set(key, res)
            return res;
        }

        this.get = function(key) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            let jsonData = this.toJSON();
            if(!jsonData) return null;
            let control = get(jsonData, key);
            if(!control) return null;

            return control;
        }

        this.fetch = function(key) {
            let control = this.get(key);
            return control;
        }

        this.has = function(key) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");

            let control = this.get(key);
            return Boolean(control);
        }

        this.all = function(limit = 0) {
            if (typeof limit !== "number") throw new ErrorShow("Must be of limit number type");
            const jsonData = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            const arr = [];
            for (const key in jsonData) {
                arr.push({
                    ID: key,
                    data: jsonData[key]
                });
            }
            return limit > 0 ? arr.splice(0, limit) : arr;
        }

        this.size = function() {
            let all = this.toJSON();
            if(!all) return Number(0);
            let alls = Object.keys(all);
            if(!alls || !alls.length || isNaN(alls.length) != false) return Number(0);
            return Number(alls.length);
        }

        this.delete = function(key) {
            if (key === "" || typeof key !== "string") throw new ErrorShow("Unapproved key");
            let jsonData = this.toJSON();
            if(!jsonData) return false;
            unset(jsonData, key)
            fs.writeFileSync(this.path, JSON.stringify(jsonData, null, 4))
            return;
        }
    }
}

module.exports = multipleCreate
