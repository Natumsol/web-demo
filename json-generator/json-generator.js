var testCase = {
    data: "{{date()}}",
    range: "range(20)",
    guid: "{{guid()}}",
    id: "{{objectId()}}",
    price: "{{floating(10,46)}}",
    inter: "{{integer(100)}}",
    phone: "{{phone()}}",
    text: "{{text(100)}}",
    country: "{{country()}}",
    city: "{{city()}}",
    string: "string"
}

console.log(generateJSON(testCase));

function generateJSON(obj) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = parse(obj[key]);
        }
    }
    return result;
}

function parse(target) {
    if (typeof target != "string")
        return target;
    if (target.match(/^{{.+}}$/)) {
        target = target.replace(/^{{|}}$/g, "");
        var funcName = target.match(/(\w+)\(/)[1];
        var arguments = target.replace(/^\w+\(|\)$/g, "").split(",").map(function (value) {
            return !!parseInt(value) ? parseInt(value) : null;
        });
        return Tools[funcName].apply(Tools, arguments);
    } else {
        return target
    }
}

function getRandom(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.random() * max;
}

var ObjectId = (function () {
    var increment = Math.floor(Math.random() * (16777216));
    var pid = Math.floor(Math.random() * (65536));
    var machine = Math.floor(Math.random() * (16777216));

    var setMachineCookie = function () {
        var cookieList = document.cookie.split('; ');
        for (var i in cookieList) {
            var cookie = cookieList[i].split('=');
            var cookieMachineId = parseInt(cookie[1], 10);
            if (cookie[0] == 'mongoMachineId' && cookieMachineId && cookieMachineId >= 0 && cookieMachineId <= 16777215) {
                machine = cookieMachineId;
                break;
            }
        }
        document.cookie = 'mongoMachineId=' + machine + ';expires=Tue, 19 Jan 2038 05:00:00 GMT;path=/';
    }
        ;
    if (typeof (localStorage) != 'undefined') {
        try {
            var mongoMachineId = parseInt(localStorage['mongoMachineId']);
            if (mongoMachineId >= 0 && mongoMachineId <= 16777215) {
                machine = Math.floor(localStorage['mongoMachineId']);
            }
            // Just always stick the value in.
            localStorage['mongoMachineId'] = machine;
        } catch (e) {
            setMachineCookie();
        }
    }
    else {
        setMachineCookie();
    }

    function ObjId() {
        if (!(this instanceof ObjectId)) {
            return new ObjectId(arguments[0], arguments[1], arguments[2], arguments[3]).toString();
        }

        if (typeof (arguments[0]) == 'object') {
            this.timestamp = arguments[0].timestamp;
            this.machine = arguments[0].machine;
            this.pid = arguments[0].pid;
            this.increment = arguments[0].increment;
        }
        else if (typeof (arguments[0]) == 'string' && arguments[0].length == 24) {
            this.timestamp = Number('0x' + arguments[0].substr(0, 8)),
            this.machine = Number('0x' + arguments[0].substr(8, 6)),
            this.pid = Number('0x' + arguments[0].substr(14, 4)),
            this.increment = Number('0x' + arguments[0].substr(18, 6))
        }
        else if (arguments.length == 4 && arguments[0] != null) {
            this.timestamp = arguments[0];
            this.machine = arguments[1];
            this.pid = arguments[2];
            this.increment = arguments[3];
        }
        else {
            this.timestamp = Math.floor(new Date().valueOf() / 1000);
            this.machine = machine;
            this.pid = pid;
            this.increment = increment++;
            if (increment > 0xffffff) {
                increment = 0;
            }
        }
    }
    ;
    return ObjId;
})();

ObjectId.prototype.getDate = function () {
    return new Date(this.timestamp * 1000);
}
;

ObjectId.prototype.toArray = function () {
    var strOid = this.toString();
    var array = [];
    var i;
    for (i = 0; i < 12; i++) {
        array[i] = parseInt(strOid.slice(i * 2, i * 2 + 2), 16);
    }
    return array;
}
;

/**
* Turns a WCF representation of a BSON ObjectId into a 24 character string representation.
*/
ObjectId.prototype.toString = function () {
    if (this.timestamp === undefined
        || this.machine === undefined
        || this.pid === undefined
        || this.increment === undefined) {
        return 'Invalid ObjectId';
    }

    var timestamp = this.timestamp.toString(16);
    var machine = this.machine.toString(16);
    var pid = this.pid.toString(16);
    var increment = this.increment.toString(16);
    return '00000000'.substr(0, 8 - timestamp.length) + timestamp +
        '000000'.substr(0, 6 - machine.length) + machine +
        '0000'.substr(0, 4 - pid.length) + pid +
        '000000'.substr(0, 6 - increment.length) + increment;
}
;

var Tools = {
    chineseCities: [
        {
            label: "北京Beijing010",
            name: "北京",
            pinyin: "Beijing",
            zip: "010"
        },
        {
            label: "重庆Chongqing023",
            name: "重庆",
            pinyin: "Chongqing",
            zip: "023"
        },
        {
            label: "上海Shanghai021",
            name: "上海",
            pinyin: "Shanghai",
            zip: "021"
        },
        {
            label: "天津Tianjin022",
            name: "天津",
            pinyin: "Tianjin",
            zip: "022"
        },
        {
            label: "长春Changchun0431",
            name: "长春",
            pinyin: "Changchun",
            zip: "0431"
        },
        {
            label: "长沙Changsha0731",
            name: "长沙",
            pinyin: "Changsha",
            zip: "0731"
        },
        {
            label: "常州Changzhou0519",
            name: "常州",
            pinyin: "Changzhou",
            zip: "0519"
        },
        {
            label: "成都Chengdu028",
            name: "成都",
            pinyin: "Chengdu",
            zip: "028"
        },
        {
            label: "大连Dalian0411",
            name: "大连",
            pinyin: "Dalian",
            zip: "0411"
        },
        {
            label: "东莞Dongguan0769",
            name: "东莞",
            pinyin: "Dongguan",
            zip: "0769"
        },
        {
            label: "佛山Foshan0757",
            name: "佛山",
            pinyin: "Foshan",
            zip: "0757"
        },
        {
            label: "福州Fuzhou0591",
            name: "福州",
            pinyin: "Fuzhou",
            zip: "0591"
        },
        {
            label: "广州Guangzhou020",
            name: "广州",
            pinyin: "Guangzhou",
            zip: "020"
        },
        {
            label: "贵阳Guiyang0851",
            name: "贵阳",
            pinyin: "Guiyang",
            zip: "0851"
        },
        {
            label: "哈尔滨Haerbin0451",
            name: "哈尔滨",
            pinyin: "Haerbin",
            zip: "0451"
        },
        {
            label: "海口Haikou0898",
            name: "海口",
            pinyin: "Haikou",
            zip: "0898"
        },
        {
            label: "邯郸Handan0310",
            name: "邯郸",
            pinyin: "Handan",
            zip: "0310"
        },
        {
            label: "杭州Hangzhou0571",
            name: "杭州",
            pinyin: "Hangzhou",
            zip: "0571"
        },
        {
            label: "合肥Hefei0551",
            name: "合肥",
            pinyin: "Hefei",
            zip: "0551"
        },
        {
            label: "惠州Huizhou0752",
            name: "惠州",
            pinyin: "Huizhou",
            zip: "0752"
        },
        {
            label: "焦作Jiaozuo0391",
            name: "焦作",
            pinyin: "Jiaozuo",
            zip: "0391"
        },
        {
            label: "嘉兴Jiaxing0573",
            name: "嘉兴",
            pinyin: "Jiaxing",
            zip: "0573"
        },
        {
            label: "吉林Jilin0423",
            name: "吉林",
            pinyin: "Jilin",
            zip: "0423"
        },
        {
            label: "济南Jinan0531",
            name: "济南",
            pinyin: "Jinan",
            zip: "0531"
        },
        {
            label: "昆明Kunming0871",
            name: "昆明",
            pinyin: "Kunming",
            zip: "0871"
        },
        {
            label: "兰州Lanzhou0931",
            name: "兰州",
            pinyin: "Lanzhou",
            zip: "0931"
        },
        {
            label: "柳州Liuzhou0772",
            name: "柳州",
            pinyin: "Liuzhou",
            zip: "0772"
        },
        {
            label: "洛阳Luoyang0379",
            name: "洛阳",
            pinyin: "Luoyang",
            zip: "0379"
        },
        {
            label: "南昌Nanchang0791",
            name: "南昌",
            pinyin: "Nanchang",
            zip: "0791"
        },
        {
            label: "南京Nanjing025",
            name: "南京",
            pinyin: "Nanjing",
            zip: "025"
        },
        {
            label: "南宁Nanning0771",
            name: "南宁",
            pinyin: "Nanning",
            zip: "0771"
        },
        {
            label: "南通Nantong0513",
            name: "南通",
            pinyin: "Nantong",
            zip: "0513"
        },
        {
            label: "宁波Ningbo0574",
            name: "宁波",
            pinyin: "Ningbo",
            zip: "0574"
        },
        {
            label: "青岛Qingdao0532",
            name: "青岛",
            pinyin: "Qingdao",
            zip: "0532"
        },
        {
            label: "泉州Quanzhou0595",
            name: "泉州",
            pinyin: "Quanzhou",
            zip: "0595"
        },
        {
            label: "沈阳Shenyang024",
            name: "沈阳",
            pinyin: "Shenyang",
            zip: "024"
        },
        {
            label: "深圳Shenzhen0755",
            name: "深圳",
            pinyin: "Shenzhen",
            zip: "0755"
        },
        {
            label: "石家庄Shijiazhuang0311",
            name: "石家庄",
            pinyin: "Shijiazhuang",
            zip: "0311"
        },
        {
            label: "苏州Suzhou0512",
            name: "苏州",
            pinyin: "Suzhou",
            zip: "0512"
        },
        {
            label: "台州Taizhou0576",
            name: "台州",
            pinyin: "Taizhou",
            zip: "0576"
        },
        {
            label: "唐山Tangshan0315",
            name: "唐山",
            pinyin: "Tangshan",
            zip: "0315"
        },
        {
            label: "潍坊Weifang0536",
            name: "潍坊",
            pinyin: "Weifang",
            zip: "0536"
        },
        {
            label: "威海Weihai0631",
            name: "威海",
            pinyin: "Weihai",
            zip: "0631"
        },
        {
            label: "武汉Wuhan027",
            name: "武汉",
            pinyin: "Wuhan",
            zip: "027"
        },
        {
            label: "无锡Wuxi0510",
            name: "无锡",
            pinyin: "Wuxi",
            zip: "0510"
        },
        {
            label: "厦门Xiamen0592",
            name: "厦门",
            pinyin: "Xiamen",
            zip: "0592"
        },
        {
            label: "西安Xian029",
            name: "西安",
            pinyin: "Xian",
            zip: "029"
        },
        {
            label: "许昌Xuchang0374",
            name: "许昌",
            pinyin: "Xuchang",
            zip: "0374"
        },
        {
            label: "徐州Xuzhou0516",
            name: "徐州",
            pinyin: "Xuzhou",
            zip: "0516"
        },
        {
            label: "扬州Yangzhou0514",
            name: "扬州",
            pinyin: "Yangzhou",
            zip: "0514"
        },
        {
            label: "烟台Yantai0535",
            name: "烟台",
            pinyin: "Yantai",
            zip: "0535"
        },
        {
            label: "漳州Zhangzhou0596",
            name: "漳州",
            pinyin: "Zhangzhou",
            zip: "0596"
        },
        {
            label: "郑州Zhengzhou0371",
            name: "郑州",
            pinyin: "Zhengzhou",
            zip: "0371"
        },
        {
            label: "中山Zhongshan0760",
            name: "中山",
            pinyin: "Zhongshan",
            zip: "0760"
        },
        {
            label: "珠海Zhuhai0756",
            name: "珠海",
            pinyin: "Zhuhai",
            zip: "0756"
        },
        {
            label: "阿坝Aba0837",
            name: "阿坝",
            pinyin: "Aba",
            zip: "0837"
        },
        {
            label: "阿克苏Akesu0997",
            name: "阿克苏",
            pinyin: "Akesu",
            zip: "0997"
        },
        {
            label: "阿拉善盟Alashanmeng0483",
            name: "阿拉善盟",
            pinyin: "Alashanmeng",
            zip: "0483"
        },
        {
            label: "阿勒泰Aletai0906",
            name: "阿勒泰",
            pinyin: "Aletai",
            zip: "0906"
        },
        {
            label: "阿里Ali0897",
            name: "阿里",
            pinyin: "Ali",
            zip: "0897"
        },
        {
            label: "安康Ankang0915",
            name: "安康",
            pinyin: "Ankang",
            zip: "0915"
        },
        {
            label: "安庆Anqing0556",
            name: "安庆",
            pinyin: "Anqing",
            zip: "0556"
        },
        {
            label: "鞍山Anshan0412",
            name: "鞍山",
            pinyin: "Anshan",
            zip: "0412"
        },
        {
            label: "安顺Anshun0853",
            name: "安顺",
            pinyin: "Anshun",
            zip: "0853"
        },
        {
            label: "安阳Anyang0372",
            name: "安阳",
            pinyin: "Anyang",
            zip: "0372"
        },
        {
            label: "白城Baicheng0436",
            name: "白城",
            pinyin: "Baicheng",
            zip: "0436"
        },
        {
            label: "百色Baise0776",
            name: "百色",
            pinyin: "Baise",
            zip: "0776"
        },
        {
            label: "白山Baishan0439",
            name: "白山",
            pinyin: "Baishan",
            zip: "0439"
        },
        {
            label: "白银Baiyin0943",
            name: "白银",
            pinyin: "Baiyin",
            zip: "0943"
        },
        {
            label: "蚌埠Bangbu0552",
            name: "蚌埠",
            pinyin: "Bangbu",
            zip: "0552"
        },
        {
            label: "保定Baoding0312",
            name: "保定",
            pinyin: "Baoding",
            zip: "0312"
        },
        {
            label: "宝鸡Baoji0917",
            name: "宝鸡",
            pinyin: "Baoji",
            zip: "0917"
        },
        {
            label: "保山Baoshan0875",
            name: "保山",
            pinyin: "Baoshan",
            zip: "0875"
        },
        {
            label: "包头Baotou0472",
            name: "包头",
            pinyin: "Baotou",
            zip: "0472"
        },
        {
            label: "巴彦淖尔Bayannaoer0478",
            name: "巴彦淖尔",
            pinyin: "Bayannaoer",
            zip: "0478"
        },
        {
            label: "巴音郭楞Bayinguoleng0996",
            name: "巴音郭楞",
            pinyin: "Bayinguoleng",
            zip: "0996"
        },
        {
            label: "巴中Bazhong0827",
            name: "巴中",
            pinyin: "Bazhong",
            zip: "0827"
        },
        {
            label: "北海Beihai0779",
            name: "北海",
            pinyin: "Beihai",
            zip: "0779"
        },
        {
            label: "本溪Benxi0414",
            name: "本溪",
            pinyin: "Benxi",
            zip: "0414"
        },
        {
            label: "毕节Bijie0857",
            name: "毕节",
            pinyin: "Bijie",
            zip: "0857"
        },
        {
            label: "滨州Binzhou0543",
            name: "滨州",
            pinyin: "Binzhou",
            zip: "0543"
        },
        {
            label: "博尔塔拉Boertala0909",
            name: "博尔塔拉",
            pinyin: "Boertala",
            zip: "0909"
        },
        {
            label: "亳州Bozhou0558",
            name: "亳州",
            pinyin: "Bozhou",
            zip: "0558"
        },
        {
            label: "沧州Cangzhou0317",
            name: "沧州",
            pinyin: "Cangzhou",
            zip: "0317"
        },
        {
            label: "常德Changde0736",
            name: "常德",
            pinyin: "Changde",
            zip: "0736"
        },
        {
            label: "昌都Changdu0895",
            name: "昌都",
            pinyin: "Changdu",
            zip: "0895"
        },
        {
            label: "昌吉Changji0997",
            name: "昌吉",
            pinyin: "Changji",
            zip: "0997"
        },
        {
            label: "长治Changzhi0355",
            name: "长治",
            pinyin: "Changzhi",
            zip: "0355"
        },
        {
            label: "巢湖Chaohu0565",
            name: "巢湖",
            pinyin: "Chaohu",
            zip: "0565"
        },
        {
            label: "朝阳Chaoyang0421",
            name: "朝阳",
            pinyin: "Chaoyang",
            zip: "0421"
        },
        {
            label: "潮州Chaozhou0768",
            name: "潮州",
            pinyin: "Chaozhou",
            zip: "0768"
        },
        {
            label: "承德Chengde0314",
            name: "承德",
            pinyin: "Chengde",
            zip: "0314"
        },
        {
            label: "郴州Chenzhou0735",
            name: "郴州",
            pinyin: "Chenzhou",
            zip: "0735"
        },
        {
            label: "赤峰Chifeng0476",
            name: "赤峰",
            pinyin: "Chifeng",
            zip: "0476"
        },
        {
            label: "池州Chizhou0566",
            name: "池州",
            pinyin: "Chizhou",
            zip: "0566"
        },
        {
            label: "崇左Chongzuo0771",
            name: "崇左",
            pinyin: "Chongzuo",
            zip: "0771"
        },
        {
            label: "楚雄Chuxiong0875",
            name: "楚雄",
            pinyin: "Chuxiong",
            zip: "0875"
        },
        {
            label: "滁州Chuzhou0550",
            name: "滁州",
            pinyin: "Chuzhou",
            zip: "0550"
        },
        {
            label: "大理Dali0872",
            name: "大理",
            pinyin: "Dali",
            zip: "0872"
        },
        {
            label: "丹东Dandong0415",
            name: "丹东",
            pinyin: "Dandong",
            zip: "0415"
        },
        {
            label: "大庆Daqing0459",
            name: "大庆",
            pinyin: "Daqing",
            zip: "0459"
        },
        {
            label: "大同Datong0352",
            name: "大同",
            pinyin: "Datong",
            zip: "0352"
        },
        {
            label: "大兴安岭Daxinganling0457",
            name: "大兴安岭",
            pinyin: "Daxinganling",
            zip: "0457"
        },
        {
            label: "达州Dazhou0818",
            name: "达州",
            pinyin: "Dazhou",
            zip: "0818"
        },
        {
            label: "德宏Dehong0692",
            name: "德宏",
            pinyin: "Dehong",
            zip: "0692"
        },
        {
            label: "德阳Deyang0838",
            name: "德阳",
            pinyin: "Deyang",
            zip: "0838"
        },
        {
            label: "德州Dezhou0534",
            name: "德州",
            pinyin: "Dezhou",
            zip: "0534"
        },
        {
            label: "定西Dingxi0932",
            name: "定西",
            pinyin: "Dingxi",
            zip: "0932"
        },
        {
            label: "迪庆Diqing0887",
            name: "迪庆",
            pinyin: "Diqing",
            zip: "0887"
        },
        {
            label: "东营Dongying0546",
            name: "东营",
            pinyin: "Dongying",
            zip: "0546"
        },
        {
            label: "鄂尔多斯Eerduosi0477",
            name: "鄂尔多斯",
            pinyin: "Eerduosi",
            zip: "0477"
        },
        {
            label: "恩施Enshi0718",
            name: "恩施",
            pinyin: "Enshi",
            zip: "0718"
        },
        {
            label: "鄂州Ezhou0711",
            name: "鄂州",
            pinyin: "Ezhou",
            zip: "0711"
        },
        {
            label: "防城港Fangchenggang0770",
            name: "防城港",
            pinyin: "Fangchenggang",
            zip: "0770"
        },
        {
            label: "抚顺Fushun0413",
            name: "抚顺",
            pinyin: "Fushun",
            zip: "0413"
        },
        {
            label: "阜新Fuxin0418",
            name: "阜新",
            pinyin: "Fuxin",
            zip: "0418"
        },
        {
            label: "阜阳Fuyang0558",
            name: "阜阳",
            pinyin: "Fuyang",
            zip: "0558"
        },
        {
            label: "抚州Fuzhou0794",
            name: "抚州",
            pinyin: "Fuzhou",
            zip: "0794"
        },
        {
            label: "甘南Gannan0941",
            name: "甘南",
            pinyin: "Gannan",
            zip: "0941"
        },
        {
            label: "赣州Ganzhou0797",
            name: "赣州",
            pinyin: "Ganzhou",
            zip: "0797"
        },
        {
            label: "甘孜Ganzi0836",
            name: "甘孜",
            pinyin: "Ganzi",
            zip: "0836"
        },
        {
            label: "广安Guangan0826",
            name: "广安",
            pinyin: "Guangan",
            zip: "0826"
        },
        {
            label: "广元Guangyuan0839",
            name: "广元",
            pinyin: "Guangyuan",
            zip: "0839"
        },
        {
            label: "贵港Guigang0775",
            name: "贵港",
            pinyin: "Guigang",
            zip: "0775"
        },
        {
            label: "桂林Guilin0773",
            name: "桂林",
            pinyin: "Guilin",
            zip: "0773"
        },
        {
            label: "果洛Guoluo0975",
            name: "果洛",
            pinyin: "Guoluo",
            zip: "0975"
        },
        {
            label: "固原Guyuan0954",
            name: "固原",
            pinyin: "Guyuan",
            zip: "0954"
        },
        {
            label: "海北Haibei0970",
            name: "海北",
            pinyin: "Haibei",
            zip: "0970"
        },
        {
            label: "海东Haidong0972",
            name: "海东",
            pinyin: "Haidong",
            zip: "0972"
        },
        {
            label: "海南Hainan0974",
            name: "海南",
            pinyin: "Hainan",
            zip: "0974"
        },
        {
            label: "海西Haixi0977",
            name: "海西",
            pinyin: "Haixi",
            zip: "0977"
        },
        {
            label: "哈密Hami0902",
            name: "哈密",
            pinyin: "Hami",
            zip: "0902"
        },
        {
            label: "汉中Hanzhong0916",
            name: "汉中",
            pinyin: "Hanzhong",
            zip: "0916"
        },
        {
            label: "鹤壁Hebi0392",
            name: "鹤壁",
            pinyin: "Hebi",
            zip: "0392"
        },
        {
            label: "河池Hechi0778",
            name: "河池",
            pinyin: "Hechi",
            zip: "0778"
        },
        {
            label: "鹤岗Hegang0468",
            name: "鹤岗",
            pinyin: "Hegang",
            zip: "0468"
        },
        {
            label: "黑河Heihe0456",
            name: "黑河",
            pinyin: "Heihe",
            zip: "0456"
        },
        {
            label: "衡水Hengshui0318",
            name: "衡水",
            pinyin: "Hengshui",
            zip: "0318"
        },
        {
            label: "衡阳Hengyang0734",
            name: "衡阳",
            pinyin: "Hengyang",
            zip: "0734"
        },
        {
            label: "和田地Hetiandi0903",
            name: "和田地",
            pinyin: "Hetiandi",
            zip: "0903"
        },
        {
            label: "河源Heyuan0762",
            name: "河源",
            pinyin: "Heyuan",
            zip: "0762"
        },
        {
            label: "菏泽Heze0530",
            name: "菏泽",
            pinyin: "Heze",
            zip: "0530"
        },
        {
            label: "贺州Hezhou0774",
            name: "贺州",
            pinyin: "Hezhou",
            zip: "0774"
        },
        {
            label: "红河Honghe0873",
            name: "红河",
            pinyin: "Honghe",
            zip: "0873"
        },
        {
            label: "淮安Huaian0517",
            name: "淮安",
            pinyin: "Huaian",
            zip: "0517"
        },
        {
            label: "淮北Huaibei0561",
            name: "淮北",
            pinyin: "Huaibei",
            zip: "0561"
        },
        {
            label: "怀化Huaihua0745",
            name: "怀化",
            pinyin: "Huaihua",
            zip: "0745"
        },
        {
            label: "淮南Huainan0554",
            name: "淮南",
            pinyin: "Huainan",
            zip: "0554"
        },
        {
            label: "黄冈Huanggang0713",
            name: "黄冈",
            pinyin: "Huanggang",
            zip: "0713"
        },
        {
            label: "黄南Huangnan0973",
            name: "黄南",
            pinyin: "Huangnan",
            zip: "0973"
        },
        {
            label: "黄山Huangshan0559",
            name: "黄山",
            pinyin: "Huangshan",
            zip: "0559"
        },
        {
            label: "黄石Huangshi0714",
            name: "黄石",
            pinyin: "Huangshi",
            zip: "0714"
        },
        {
            label: "呼和浩特Huhehaote0471",
            name: "呼和浩特",
            pinyin: "Huhehaote",
            zip: "0471"
        },
        {
            label: "葫芦岛Huludao0429",
            name: "葫芦岛",
            pinyin: "Huludao",
            zip: "0429"
        },
        {
            label: "呼伦贝尔Hulunbeier0470",
            name: "呼伦贝尔",
            pinyin: "Hulunbeier",
            zip: "0470"
        },
        {
            label: "湖州Huzhou0572",
            name: "湖州",
            pinyin: "Huzhou",
            zip: "0572"
        },
        {
            label: "佳木斯Jiamusi0454",
            name: "佳木斯",
            pinyin: "Jiamusi",
            zip: "0454"
        },
        {
            label: "江门Jiangmen0750",
            name: "江门",
            pinyin: "Jiangmen",
            zip: "0750"
        },
        {
            label: "吉安Jian0796",
            name: "吉安",
            pinyin: "Jian",
            zip: "0796"
        },
        {
            label: "嘉峪关Jiayuguan0937",
            name: "嘉峪关",
            pinyin: "Jiayuguan",
            zip: "0937"
        },
        {
            label: "揭阳Jieyang0663",
            name: "揭阳",
            pinyin: "Jieyang",
            zip: "0663"
        },
        {
            label: "金昌Jinchang0935",
            name: "金昌",
            pinyin: "Jinchang",
            zip: "0935"
        },
        {
            label: "晋城Jincheng0356",
            name: "晋城",
            pinyin: "Jincheng",
            zip: "0356"
        },
        {
            label: "景德镇Jingdezhen0798",
            name: "景德镇",
            pinyin: "Jingdezhen",
            zip: "0798"
        },
        {
            label: "荆门Jingmen0724",
            name: "荆门",
            pinyin: "Jingmen",
            zip: "0724"
        },
        {
            label: "荆州Jingzhou0716",
            name: "荆州",
            pinyin: "Jingzhou",
            zip: "0716"
        },
        {
            label: "金华Jinhua0579",
            name: "金华",
            pinyin: "Jinhua",
            zip: "0579"
        },
        {
            label: "济宁Jining0537",
            name: "济宁",
            pinyin: "Jining",
            zip: "0537"
        },
        {
            label: "晋中Jinzhong0354",
            name: "晋中",
            pinyin: "Jinzhong",
            zip: "0354"
        },
        {
            label: "锦州Jinzhou0416",
            name: "锦州",
            pinyin: "Jinzhou",
            zip: "0416"
        },
        {
            label: "九江Jiujiang0792",
            name: "九江",
            pinyin: "Jiujiang",
            zip: "0792"
        },
        {
            label: "酒泉Jiuquan0937",
            name: "酒泉",
            pinyin: "Jiuquan",
            zip: "0937"
        },
        {
            label: "鸡西Jixi0467",
            name: "鸡西",
            pinyin: "Jixi",
            zip: "0467"
        },
        {
            label: "开封Kaifeng0378",
            name: "开封",
            pinyin: "Kaifeng",
            zip: "0378"
        },
        {
            label: "喀什地Kashidi0998",
            name: "喀什地",
            pinyin: "Kashidi",
            zip: "0998"
        },
        {
            label: "克拉玛依Kelamayi0990",
            name: "克拉玛依",
            pinyin: "Kelamayi",
            zip: "0990"
        },
        {
            label: "克孜勒Kezile0908",
            name: "克孜勒",
            pinyin: "Kezile",
            zip: "0908"
        },
        {
            label: "来宾Laibin0772",
            name: "来宾",
            pinyin: "Laibin",
            zip: "0772"
        },
        {
            label: "莱芜Laiwu0634",
            name: "莱芜",
            pinyin: "Laiwu",
            zip: "0634"
        },
        {
            label: "廊坊Langfang0316",
            name: "廊坊",
            pinyin: "Langfang",
            zip: "0316"
        },
        {
            label: "拉萨Lasa0891",
            name: "拉萨",
            pinyin: "Lasa",
            zip: "0891"
        },
        {
            label: "乐山Leshan0833",
            name: "乐山",
            pinyin: "Leshan",
            zip: "0833"
        },
        {
            label: "凉山Liangshan0834",
            name: "凉山",
            pinyin: "Liangshan",
            zip: "0834"
        },
        {
            label: "连云港Lianyungang0518",
            name: "连云港",
            pinyin: "Lianyungang",
            zip: "0518"
        },
        {
            label: "聊城Liaocheng0635",
            name: "聊城",
            pinyin: "Liaocheng",
            zip: "0635"
        },
        {
            label: "辽阳Liaoyang0419",
            name: "辽阳",
            pinyin: "Liaoyang",
            zip: "0419"
        },
        {
            label: "辽源Liaoyuan0437",
            name: "辽源",
            pinyin: "Liaoyuan",
            zip: "0437"
        },
        {
            label: "丽江Lijiang0888",
            name: "丽江",
            pinyin: "Lijiang",
            zip: "0888"
        },
        {
            label: "临沧Lincang0883",
            name: "临沧",
            pinyin: "Lincang",
            zip: "0883"
        },
        {
            label: "临汾Linfen0357",
            name: "临汾",
            pinyin: "Linfen",
            zip: "0357"
        },
        {
            label: "临夏Linxia0930",
            name: "临夏",
            pinyin: "Linxia",
            zip: "0930"
        },
        {
            label: "临沂Linyi0539",
            name: "临沂",
            pinyin: "Linyi",
            zip: "0539"
        },
        {
            label: "林芝Linzhi0894",
            name: "林芝",
            pinyin: "Linzhi",
            zip: "0894"
        },
        {
            label: "丽水Lishui0578",
            name: "丽水",
            pinyin: "Lishui",
            zip: "0578"
        },
        {
            label: "六安Liuan0564",
            name: "六安",
            pinyin: "Liuan",
            zip: "0564"
        },
        {
            label: "六盘水Liupanshui0858",
            name: "六盘水",
            pinyin: "Liupanshui",
            zip: "0858"
        },
        {
            label: "陇南Longnan0939",
            name: "陇南",
            pinyin: "Longnan",
            zip: "0939"
        },
        {
            label: "龙岩Longyan0597",
            name: "龙岩",
            pinyin: "Longyan",
            zip: "0597"
        },
        {
            label: "娄底Loudi0738",
            name: "娄底",
            pinyin: "Loudi",
            zip: "0738"
        },
        {
            label: "漯河Luohe0395",
            name: "漯河",
            pinyin: "Luohe",
            zip: "0395"
        },
        {
            label: "泸州Luzhou0830",
            name: "泸州",
            pinyin: "Luzhou",
            zip: "0830"
        },
        {
            label: "吕梁Lvliang0358",
            name: "吕梁",
            pinyin: "Lvliang",
            zip: "0358"
        },
        {
            label: "马鞍山Maanshan0555",
            name: "马鞍山",
            pinyin: "Maanshan",
            zip: "0555"
        },
        {
            label: "茂名Maoming0668",
            name: "茂名",
            pinyin: "Maoming",
            zip: "0668"
        },
        {
            label: "眉山Meishan028",
            name: "眉山",
            pinyin: "Meishan",
            zip: "028"
        },
        {
            label: "梅州Meizhou0753",
            name: "梅州",
            pinyin: "Meizhou",
            zip: "0753"
        },
        {
            label: "绵阳Mianyang0816",
            name: "绵阳",
            pinyin: "Mianyang",
            zip: "0816"
        },
        {
            label: "牡丹江Mudanjiang0453",
            name: "牡丹江",
            pinyin: "Mudanjiang",
            zip: "0453"
        },
        {
            label: "南充Nanchong0817",
            name: "南充",
            pinyin: "Nanchong",
            zip: "0817"
        },
        {
            label: "南平Nanping0599",
            name: "南平",
            pinyin: "Nanping",
            zip: "0599"
        },
        {
            label: "南阳Nanyang0377",
            name: "南阳",
            pinyin: "Nanyang",
            zip: "0377"
        },
        {
            label: "那曲Naqu0896",
            name: "那曲",
            pinyin: "Naqu",
            zip: "0896"
        },
        {
            label: "内江Neijiang0832",
            name: "内江",
            pinyin: "Neijiang",
            zip: "0832"
        },
        {
            label: "宁德Ningde0593",
            name: "宁德",
            pinyin: "Ningde",
            zip: "0593"
        },
        {
            label: "怒江Nujiang0886",
            name: "怒江",
            pinyin: "Nujiang",
            zip: "0886"
        },
        {
            label: "盘锦Panjin0427",
            name: "盘锦",
            pinyin: "Panjin",
            zip: "0427"
        },
        {
            label: "攀枝花Panzhihua0812",
            name: "攀枝花",
            pinyin: "Panzhihua",
            zip: "0812"
        },
        {
            label: "平顶山Pingdingshan0375",
            name: "平顶山",
            pinyin: "Pingdingshan",
            zip: "0375"
        },
        {
            label: "平凉Pingliang0933",
            name: "平凉",
            pinyin: "Pingliang",
            zip: "0933"
        },
        {
            label: "萍乡Pingxiang0799",
            name: "萍乡",
            pinyin: "Pingxiang",
            zip: "0799"
        },
        {
            label: "普洱Puer0879",
            name: "普洱",
            pinyin: "Puer",
            zip: "0879"
        },
        {
            label: "莆田Putian0594",
            name: "莆田",
            pinyin: "Putian",
            zip: "0594"
        },
        {
            label: "濮阳Puyang0393",
            name: "濮阳",
            pinyin: "Puyang",
            zip: "0393"
        },
        {
            label: "黔东Qiandong0855",
            name: "黔东",
            pinyin: "Qiandong",
            zip: "0855"
        },
        {
            label: "黔南Qiannan0854",
            name: "黔南",
            pinyin: "Qiannan",
            zip: "0854"
        },
        {
            label: "黔西南Qianxinan0859",
            name: "黔西南",
            pinyin: "Qianxinan",
            zip: "0859"
        },
        {
            label: "庆阳Qingyang0934",
            name: "庆阳",
            pinyin: "Qingyang",
            zip: "0934"
        },
        {
            label: "清远Qingyuan0763",
            name: "清远",
            pinyin: "Qingyuan",
            zip: "0763"
        },
        {
            label: "秦皇岛Qinhuangdao0335",
            name: "秦皇岛",
            pinyin: "Qinhuangdao",
            zip: "0335"
        },
        {
            label: "钦州Qinzhou0777",
            name: "钦州",
            pinyin: "Qinzhou",
            zip: "0777"
        },
        {
            label: "齐齐哈尔Qiqihaer0452",
            name: "齐齐哈尔",
            pinyin: "Qiqihaer",
            zip: "0452"
        },
        {
            label: "七台河Qitaihe0464",
            name: "七台河",
            pinyin: "Qitaihe",
            zip: "0464"
        },
        {
            label: "曲靖Qujing0874",
            name: "曲靖",
            pinyin: "Qujing",
            zip: "0874"
        },
        {
            label: "衢州Quzhou0570",
            name: "衢州",
            pinyin: "Quzhou",
            zip: "0570"
        },
        {
            label: "日喀则Rikaze0892",
            name: "日喀则",
            pinyin: "Rikaze",
            zip: "0892"
        },
        {
            label: "日照Rizhao0633",
            name: "日照",
            pinyin: "Rizhao",
            zip: "0633"
        },
        {
            label: "三门峡Sanmenxia0398",
            name: "三门峡",
            pinyin: "Sanmenxia",
            zip: "0398"
        },
        {
            label: "三明Sanming0598",
            name: "三明",
            pinyin: "Sanming",
            zip: "0598"
        },
        {
            label: "三亚Sanya0899",
            name: "三亚",
            pinyin: "Sanya",
            zip: "0899"
        },
        {
            label: "商洛Shangluo0914",
            name: "商洛",
            pinyin: "Shangluo",
            zip: "0914"
        },
        {
            label: "商丘Shangqiu0370",
            name: "商丘",
            pinyin: "Shangqiu",
            zip: "0370"
        },
        {
            label: "上饶Shangrao0793",
            name: "上饶",
            pinyin: "Shangrao",
            zip: "0793"
        },
        {
            label: "山南Shannan0893",
            name: "山南",
            pinyin: "Shannan",
            zip: "0893"
        },
        {
            label: "汕头Shantou0754",
            name: "汕头",
            pinyin: "Shantou",
            zip: "0754"
        },
        {
            label: "汕尾Shanwei0660",
            name: "汕尾",
            pinyin: "Shanwei",
            zip: "0660"
        },
        {
            label: "韶关Shaoguan0751",
            name: "韶关",
            pinyin: "Shaoguan",
            zip: "0751"
        },
        {
            label: "绍兴Shaoxing0575",
            name: "绍兴",
            pinyin: "Shaoxing",
            zip: "0575"
        },
        {
            label: "邵阳Shaoyang0739",
            name: "邵阳",
            pinyin: "Shaoyang",
            zip: "0739"
        },
        {
            label: "十堰Shiyan0719",
            name: "十堰",
            pinyin: "Shiyan",
            zip: "0719"
        },
        {
            label: "石嘴山Shizuishan0952",
            name: "石嘴山",
            pinyin: "Shizuishan",
            zip: "0952"
        },
        {
            label: "双鸭山Shuangyashan0469",
            name: "双鸭山",
            pinyin: "Shuangyashan",
            zip: "0469"
        },
        {
            label: "朔州Shuozhou0349",
            name: "朔州",
            pinyin: "Shuozhou",
            zip: "0349"
        },
        {
            label: "四平Siping0434",
            name: "四平",
            pinyin: "Siping",
            zip: "0434"
        },
        {
            label: "松原Songyuan0438",
            name: "松原",
            pinyin: "Songyuan",
            zip: "0438"
        },
        {
            label: "绥化Suihua0455",
            name: "绥化",
            pinyin: "Suihua",
            zip: "0455"
        },
        {
            label: "遂宁Suining0825",
            name: "遂宁",
            pinyin: "Suining",
            zip: "0825"
        },
        {
            label: "随州Suizhou0722",
            name: "随州",
            pinyin: "Suizhou",
            zip: "0722"
        },
        {
            label: "宿迁Suqian0527",
            name: "宿迁",
            pinyin: "Suqian",
            zip: "0527"
        },
        {
            label: "宿州Suzhou0557",
            name: "宿州",
            pinyin: "Suzhou",
            zip: "0557"
        },
        {
            label: "塔城地Tachengdi0901",
            name: "塔城地",
            pinyin: "Tachengdi",
            zip: "0901"
        },
        {
            label: "泰安Taian0538",
            name: "泰安",
            pinyin: "Taian",
            zip: "0538"
        },
        {
            label: "太原Taiyuan0351",
            name: "太原",
            pinyin: "Taiyuan",
            zip: "0351"
        },
        {
            label: "泰州Taizhou0523",
            name: "泰州",
            pinyin: "Taizhou",
            zip: "0523"
        },
        {
            label: "天水Tianshui0938",
            name: "天水",
            pinyin: "Tianshui",
            zip: "0938"
        },
        {
            label: "铁岭Tieling0410",
            name: "铁岭",
            pinyin: "Tieling",
            zip: "0410"
        },
        {
            label: "铜川Tongchuan0919",
            name: "铜川",
            pinyin: "Tongchuan",
            zip: "0919"
        },
        {
            label: "通化Tonghua0435",
            name: "通化",
            pinyin: "Tonghua",
            zip: "0435"
        },
        {
            label: "通辽Tongliao0475",
            name: "通辽",
            pinyin: "Tongliao",
            zip: "0475"
        },
        {
            label: "铜陵Tongling0562",
            name: "铜陵",
            pinyin: "Tongling",
            zip: "0562"
        },
        {
            label: "铜仁Tongren0856",
            name: "铜仁",
            pinyin: "Tongren",
            zip: "0856"
        },
        {
            label: "吐鲁番Tulufan0995",
            name: "吐鲁番",
            pinyin: "Tulufan",
            zip: "0995"
        },
        {
            label: "渭南Weinan0913",
            name: "渭南",
            pinyin: "Weinan",
            zip: "0913"
        },
        {
            label: "文山Wenshan0876",
            name: "文山",
            pinyin: "Wenshan",
            zip: "0876"
        },
        {
            label: "温州Wenzhou0577",
            name: "温州",
            pinyin: "Wenzhou",
            zip: "0577"
        },
        {
            label: "乌海Wuhai0473",
            name: "乌海",
            pinyin: "Wuhai",
            zip: "0473"
        },
        {
            label: "芜湖Wuhu0553",
            name: "芜湖",
            pinyin: "Wuhu",
            zip: "0553"
        },
        {
            label: "乌兰察布Wulanchabu0474",
            name: "乌兰察布",
            pinyin: "Wulanchabu",
            zip: "0474"
        },
        {
            label: "乌鲁木齐Wulumuqi0991",
            name: "乌鲁木齐",
            pinyin: "Wulumuqi",
            zip: "0991"
        },
        {
            label: "武威Wuwei0935",
            name: "武威",
            pinyin: "Wuwei",
            zip: "0935"
        },
        {
            label: "吴忠Wuzhong0953",
            name: "吴忠",
            pinyin: "Wuzhong",
            zip: "0953"
        },
        {
            label: "梧州Wuzhou0774",
            name: "梧州",
            pinyin: "Wuzhou",
            zip: "0774"
        },
        {
            label: "襄樊Xiangfan0710",
            name: "襄樊",
            pinyin: "Xiangfan",
            zip: "0710"
        },
        {
            label: "湘潭Xiangtan0732",
            name: "湘潭",
            pinyin: "Xiangtan",
            zip: "0732"
        },
        {
            label: "湘西Xiangxi0743",
            name: "湘西",
            pinyin: "Xiangxi",
            zip: "0743"
        },
        {
            label: "咸宁Xianning0715",
            name: "咸宁",
            pinyin: "Xianning",
            zip: "0715"
        },
        {
            label: "咸阳Xianyang029",
            name: "咸阳",
            pinyin: "Xianyang",
            zip: "029"
        },
        {
            label: "孝感Xiaogan0712",
            name: "孝感",
            pinyin: "Xiaogan",
            zip: "0712"
        },
        {
            label: "锡林郭勒盟Xilinguolemeng0479",
            name: "锡林郭勒盟",
            pinyin: "Xilinguolemeng",
            zip: "0479"
        },
        {
            label: "兴安盟Xinganmeng0482",
            name: "兴安盟",
            pinyin: "Xinganmeng",
            zip: "0482"
        },
        {
            label: "邢台Xingtai0319",
            name: "邢台",
            pinyin: "Xingtai",
            zip: "0319"
        },
        {
            label: "西宁Xining0971",
            name: "西宁",
            pinyin: "Xining",
            zip: "0971"
        },
        {
            label: "新乡Xinxiang0373",
            name: "新乡",
            pinyin: "Xinxiang",
            zip: "0373"
        },
        {
            label: "信阳Xinyang0376",
            name: "信阳",
            pinyin: "Xinyang",
            zip: "0376"
        },
        {
            label: "新余Xinyu0790",
            name: "新余",
            pinyin: "Xinyu",
            zip: "0790"
        },
        {
            label: "忻州Xinzhou0350",
            name: "忻州",
            pinyin: "Xinzhou",
            zip: "0350"
        },
        {
            label: "西双版纳Xishuangbanna0691",
            name: "西双版纳",
            pinyin: "Xishuangbanna",
            zip: "0691"
        },
        {
            label: "宣城Xuancheng0563",
            name: "宣城",
            pinyin: "Xuancheng",
            zip: "0563"
        },
        {
            label: "雅安Yaan0835",
            name: "雅安",
            pinyin: "Yaan",
            zip: "0835"
        },
        {
            label: "延安Yanan0911",
            name: "延安",
            pinyin: "Yanan",
            zip: "0911"
        },
        {
            label: "延边Yanbian0433",
            name: "延边",
            pinyin: "Yanbian",
            zip: "0433"
        },
        {
            label: "盐城Yancheng0515",
            name: "盐城",
            pinyin: "Yancheng",
            zip: "0515"
        },
        {
            label: "阳江Yangjiang0662",
            name: "阳江",
            pinyin: "Yangjiang",
            zip: "0662"
        },
        {
            label: "阳泉Yangquan0353",
            name: "阳泉",
            pinyin: "Yangquan",
            zip: "0353"
        },
        {
            label: "宜宾Yibin0831",
            name: "宜宾",
            pinyin: "Yibin",
            zip: "0831"
        },
        {
            label: "宜昌Yichang0717",
            name: "宜昌",
            pinyin: "Yichang",
            zip: "0717"
        },
        {
            label: "伊春Yichun0458",
            name: "伊春",
            pinyin: "Yichun",
            zip: "0458"
        },
        {
            label: "宜春Yichun0795",
            name: "宜春",
            pinyin: "Yichun",
            zip: "0795"
        },
        {
            label: "伊犁哈萨克Yilihasake0999",
            name: "伊犁哈萨克",
            pinyin: "Yilihasake",
            zip: "0999"
        },
        {
            label: "银川Yinchuan0951",
            name: "银川",
            pinyin: "Yinchuan",
            zip: "0951"
        },
        {
            label: "营口Yingkou0417",
            name: "营口",
            pinyin: "Yingkou",
            zip: "0417"
        },
        {
            label: "鹰潭Yingtan0701",
            name: "鹰潭",
            pinyin: "Yingtan",
            zip: "0701"
        },
        {
            label: "益阳Yiyang0737",
            name: "益阳",
            pinyin: "Yiyang",
            zip: "0737"
        },
        {
            label: "永州Yongzhou0746",
            name: "永州",
            pinyin: "Yongzhou",
            zip: "0746"
        },
        {
            label: "岳阳Yueyang0730",
            name: "岳阳",
            pinyin: "Yueyang",
            zip: "0730"
        },
        {
            label: "玉林Yulin0775",
            name: "玉林",
            pinyin: "Yulin",
            zip: "0775"
        },
        {
            label: "榆林Yulin0912",
            name: "榆林",
            pinyin: "Yulin",
            zip: "0912"
        },
        {
            label: "运城Yuncheng0359",
            name: "运城",
            pinyin: "Yuncheng",
            zip: "0359"
        },
        {
            label: "云浮Yunfu0766",
            name: "云浮",
            pinyin: "Yunfu",
            zip: "0766"
        },
        {
            label: "玉树Yushu0976",
            name: "玉树",
            pinyin: "Yushu",
            zip: "0976"
        },
        {
            label: "玉溪Yuxi0877",
            name: "玉溪",
            pinyin: "Yuxi",
            zip: "0877"
        },
        {
            label: "枣庄Zaozhuang0623",
            name: "枣庄",
            pinyin: "Zaozhuang",
            zip: "0623"
        },
        {
            label: "张家界Zhangjiajie0744",
            name: "张家界",
            pinyin: "Zhangjiajie",
            zip: "0744"
        },
        {
            label: "张家口Zhangjiakou0313",
            name: "张家口",
            pinyin: "Zhangjiakou",
            zip: "0313"
        },
        {
            label: "张掖Zhangye0936",
            name: "张掖",
            pinyin: "Zhangye",
            zip: "0936"
        },
        {
            label: "湛江Zhanjiang0759",
            name: "湛江",
            pinyin: "Zhanjiang",
            zip: "0759"
        },
        {
            label: "肇庆Zhaoqing0758",
            name: "肇庆",
            pinyin: "Zhaoqing",
            zip: "0758"
        },
        {
            label: "昭通Zhaotong0870",
            name: "昭通",
            pinyin: "Zhaotong",
            zip: "0870"
        },
        {
            label: "镇江Zhenjiang0511",
            name: "镇江",
            pinyin: "Zhenjiang",
            zip: "0511"
        },
        {
            label: "中卫Zhongwei0955",
            name: "中卫",
            pinyin: "Zhongwei",
            zip: "0955"
        },
        {
            label: "周口Zhoukou0394",
            name: "周口",
            pinyin: "Zhoukou",
            zip: "0394"
        },
        {
            label: "舟山Zhoushan0580",
            name: "舟山",
            pinyin: "Zhoushan",
            zip: "0580"
        },
        {
            label: "驻马店Zhumadian0396",
            name: "驻马店",
            pinyin: "Zhumadian",
            zip: "0396"
        },
        {
            label: "株洲Zhuzhou0731",
            name: "株洲",
            pinyin: "Zhuzhou",
            zip: "0731"
        },
        {
            label: "淄博Zibo0533",
            name: "淄博",
            pinyin: "Zibo",
            zip: "0533"
        },
        {
            label: "自贡Zigong0813",
            name: "自贡",
            pinyin: "Zigong",
            zip: "0813"
        },
        {
            label: "资阳Ziyang028",
            name: "资阳",
            pinyin: "Ziyang",
            zip: "028"
        },
        {
            label: "遵义Zunyi0852",
            name: "遵义",
            pinyin: "Zunyi",
            zip: "0852"
        },
        {
            label: "阿城Acheng0451",
            name: "阿城",
            pinyin: "Acheng",
            zip: "0451"
        },
        {
            label: "安福Anfu0796",
            name: "安福",
            pinyin: "Anfu",
            zip: "0796"
        },
        {
            label: "安吉Anji0572",
            name: "安吉",
            pinyin: "Anji",
            zip: "0572"
        },
        {
            label: "安宁Anning0871",
            name: "安宁",
            pinyin: "Anning",
            zip: "0871"
        },
        {
            label: "安丘Anqiu0536",
            name: "安丘",
            pinyin: "Anqiu",
            zip: "0536"
        },
        {
            label: "安溪Anxi0595",
            name: "安溪",
            pinyin: "Anxi",
            zip: "0595"
        },
        {
            label: "安义Anyi0791",
            name: "安义",
            pinyin: "Anyi",
            zip: "0791"
        },
        {
            label: "安远Anyuan0797",
            name: "安远",
            pinyin: "Anyuan",
            zip: "0797"
        },
        {
            label: "宝应Baoying0514",
            name: "宝应",
            pinyin: "Baoying",
            zip: "0514"
        },
        {
            label: "巴彦Bayan0451",
            name: "巴彦",
            pinyin: "Bayan",
            zip: "0451"
        },
        {
            label: "滨海Binhai0515",
            name: "滨海",
            pinyin: "Binhai",
            zip: "0515"
        },
        {
            label: "宾县Binxian0451",
            name: "宾县",
            pinyin: "Binxian",
            zip: "0451"
        },
        {
            label: "宾阳Binyang0771",
            name: "宾阳",
            pinyin: "Binyang",
            zip: "0771"
        },
        {
            label: "璧山Bishan023",
            name: "璧山",
            pinyin: "Bishan",
            zip: "023"
        },
        {
            label: "博爱Boai0391",
            name: "博爱",
            pinyin: "Boai",
            zip: "0391"
        },
        {
            label: "博罗Boluo0752",
            name: "博罗",
            pinyin: "Boluo",
            zip: "0752"
        },
        {
            label: "博兴Boxing0543",
            name: "博兴",
            pinyin: "Boxing",
            zip: "0543"
        },
        {
            label: "苍南Cangnan0577",
            name: "苍南",
            pinyin: "Cangnan",
            zip: "0577"
        },
        {
            label: "苍山Cangshan0539",
            name: "苍山",
            pinyin: "Cangshan",
            zip: "0539"
        },
        {
            label: "曹县Caoxian0530",
            name: "曹县",
            pinyin: "Caoxian",
            zip: "0530"
        },
        {
            label: "长岛Changdao0535",
            name: "长岛",
            pinyin: "Changdao",
            zip: "0535"
        },
        {
            label: "长丰Changfeng0551",
            name: "长丰",
            pinyin: "Changfeng",
            zip: "0551"
        },
        {
            label: "长海Changhai0411",
            name: "长海",
            pinyin: "Changhai",
            zip: "0411"
        },
        {
            label: "长乐Changle0591",
            name: "长乐",
            pinyin: "Changle",
            zip: "0591"
        },
        {
            label: "昌乐Changle0536",
            name: "昌乐",
            pinyin: "Changle",
            zip: "0536"
        },
        {
            label: "常山Changshan0570",
            name: "常山",
            pinyin: "Changshan",
            zip: "0570"
        },
        {
            label: "常熟Changshu0512",
            name: "常熟",
            pinyin: "Changshu",
            zip: "0512"
        },
        {
            label: "长泰Changtai0596",
            name: "长泰",
            pinyin: "Changtai",
            zip: "0596"
        },
        {
            label: "长汀Changting0597",
            name: "长汀",
            pinyin: "Changting",
            zip: "0597"
        },
        {
            label: "长兴Changxing0572",
            name: "长兴",
            pinyin: "Changxing",
            zip: "0572"
        },
        {
            label: "昌邑Changyi0536",
            name: "昌邑",
            pinyin: "Changyi",
            zip: "0536"
        },
        {
            label: "潮安Chaoan0768",
            name: "潮安",
            pinyin: "Chaoan",
            zip: "0768"
        },
        {
            label: "呈贡Chenggong0871",
            name: "呈贡",
            pinyin: "Chenggong",
            zip: "0871"
        },
        {
            label: "城口Chengkou023",
            name: "城口",
            pinyin: "Chengkou",
            zip: "023"
        },
        {
            label: "成武Chengwu0530",
            name: "成武",
            pinyin: "Chengwu",
            zip: "0530"
        },
        {
            label: "茌平Chiping0635",
            name: "茌平",
            pinyin: "Chiping",
            zip: "0635"
        },
        {
            label: "崇仁Chongren0794",
            name: "崇仁",
            pinyin: "Chongren",
            zip: "0794"
        },
        {
            label: "崇义Chongyi0797",
            name: "崇义",
            pinyin: "Chongyi",
            zip: "0797"
        },
        {
            label: "崇州Chongzhou028",
            name: "崇州",
            pinyin: "Chongzhou",
            zip: "028"
        },
        {
            label: "淳安Chunan0571",
            name: "淳安",
            pinyin: "Chunan",
            zip: "0571"
        },
        {
            label: "慈溪Cixi0574",
            name: "慈溪",
            pinyin: "Cixi",
            zip: "0574"
        },
        {
            label: "从化Conghua020",
            name: "从化",
            pinyin: "Conghua",
            zip: "020"
        },
        {
            label: "枞阳Congyang0556",
            name: "枞阳",
            pinyin: "Congyang",
            zip: "0556"
        },
        {
            label: "大丰Dafeng0515",
            name: "大丰",
            pinyin: "Dafeng",
            zip: "0515"
        },
        {
            label: "岱山Daishan0580",
            name: "岱山",
            pinyin: "Daishan",
            zip: "0580"
        },
        {
            label: "砀山Dangshan0557",
            name: "砀山",
            pinyin: "Dangshan",
            zip: "0557"
        },
        {
            label: "当涂Dangtu0555",
            name: "当涂",
            pinyin: "Dangtu",
            zip: "0555"
        },
        {
            label: "单县Danxian0530",
            name: "单县",
            pinyin: "Danxian",
            zip: "0530"
        },
        {
            label: "丹阳Danyang0511",
            name: "丹阳",
            pinyin: "Danyang",
            zip: "0511"
        },
        {
            label: "大埔Dapu0753",
            name: "大埔",
            pinyin: "Dapu",
            zip: "0753"
        },
        {
            label: "大田Datian0598",
            name: "大田",
            pinyin: "Datian",
            zip: "0598"
        },
        {
            label: "大邑Dayi028",
            name: "大邑",
            pinyin: "Dayi",
            zip: "028"
        },
        {
            label: "大余Dayu0797",
            name: "大余",
            pinyin: "Dayu",
            zip: "0797"
        },
        {
            label: "大足Dazu023",
            name: "大足",
            pinyin: "Dazu",
            zip: "023"
        },
        {
            label: "德安Dean0792",
            name: "德安",
            pinyin: "Dean",
            zip: "0792"
        },
        {
            label: "德化Dehua0595",
            name: "德化",
            pinyin: "Dehua",
            zip: "0595"
        },
        {
            label: "德惠Dehui0431",
            name: "德惠",
            pinyin: "Dehui",
            zip: "0431"
        },
        {
            label: "登封Dengfeng0371",
            name: "登封",
            pinyin: "Dengfeng",
            zip: "0371"
        },
        {
            label: "德清Deqing0572",
            name: "德清",
            pinyin: "Deqing",
            zip: "0572"
        },
        {
            label: "德庆Deqing0758",
            name: "德庆",
            pinyin: "Deqing",
            zip: "0758"
        },
        {
            label: "德兴Dexing0793",
            name: "德兴",
            pinyin: "Dexing",
            zip: "0793"
        },
        {
            label: "电白Dianbai0668",
            name: "电白",
            pinyin: "Dianbai",
            zip: "0668"
        },
        {
            label: "垫江Dianjiang023",
            name: "垫江",
            pinyin: "Dianjiang",
            zip: "023"
        },
        {
            label: "定南Dingnan0797",
            name: "定南",
            pinyin: "Dingnan",
            zip: "0797"
        },
        {
            label: "定陶Dingtao0530",
            name: "定陶",
            pinyin: "Dingtao",
            zip: "0530"
        },
        {
            label: "定远Dingyuan0550",
            name: "定远",
            pinyin: "Dingyuan",
            zip: "0550"
        },
        {
            label: "东阿Donga0635",
            name: "东阿",
            pinyin: "Donga",
            zip: "0635"
        },
        {
            label: "东海Donghai0518",
            name: "东海",
            pinyin: "Donghai",
            zip: "0518"
        },
        {
            label: "东明Dongming0530",
            name: "东明",
            pinyin: "Dongming",
            zip: "0530"
        },
        {
            label: "东平Dongping0538",
            name: "东平",
            pinyin: "Dongping",
            zip: "0538"
        },
        {
            label: "东山Dongshan0596",
            name: "东山",
            pinyin: "Dongshan",
            zip: "0596"
        },
        {
            label: "东台Dongtai0515",
            name: "东台",
            pinyin: "Dongtai",
            zip: "0515"
        },
        {
            label: "洞头Dongtou0577",
            name: "洞头",
            pinyin: "Dongtou",
            zip: "0577"
        },
        {
            label: "东乡Dongxiang0794",
            name: "东乡",
            pinyin: "Dongxiang",
            zip: "0794"
        },
        {
            label: "东阳Dongyang0579",
            name: "东阳",
            pinyin: "Dongyang",
            zip: "0579"
        },
        {
            label: "东源Dongyuan0762",
            name: "东源",
            pinyin: "Dongyuan",
            zip: "0762"
        },
        {
            label: "东至Dongzhi0566",
            name: "东至",
            pinyin: "Dongzhi",
            zip: "0566"
        },
        {
            label: "都昌Duchang0792",
            name: "都昌",
            pinyin: "Duchang",
            zip: "0792"
        },
        {
            label: "都江堰Dujiangyan028",
            name: "都江堰",
            pinyin: "Dujiangyan",
            zip: "028"
        },
        {
            label: "恩平Enping0750",
            name: "恩平",
            pinyin: "Enping",
            zip: "0750"
        },
        {
            label: "法库Faku024",
            name: "法库",
            pinyin: "Faku",
            zip: "024"
        },
        {
            label: "繁昌Fanchang0553",
            name: "繁昌",
            pinyin: "Fanchang",
            zip: "0553"
        },
        {
            label: "方正Fangzheng0451",
            name: "方正",
            pinyin: "Fangzheng",
            zip: "0451"
        },
        {
            label: "肥城Feicheng0538",
            name: "肥城",
            pinyin: "Feicheng",
            zip: "0538"
        },
        {
            label: "肥东Feidong0551",
            name: "肥东",
            pinyin: "Feidong",
            zip: "0551"
        },
        {
            label: "肥西Feixi0551",
            name: "肥西",
            pinyin: "Feixi",
            zip: "0551"
        },
        {
            label: "费县Feixian0539",
            name: "费县",
            pinyin: "Feixian",
            zip: "0539"
        },
        {
            label: "丰城Fengcheng0795",
            name: "丰城",
            pinyin: "Fengcheng",
            zip: "0795"
        },
        {
            label: "丰都Fengdu023",
            name: "丰都",
            pinyin: "Fengdu",
            zip: "023"
        },
        {
            label: "奉化Fenghua0574",
            name: "奉化",
            pinyin: "Fenghua",
            zip: "0574"
        },
        {
            label: "奉节Fengjie023",
            name: "奉节",
            pinyin: "Fengjie",
            zip: "023"
        },
        {
            label: "封开Fengkai0758",
            name: "封开",
            pinyin: "Fengkai",
            zip: "0758"
        },
        {
            label: "丰顺Fengshun0753",
            name: "丰顺",
            pinyin: "Fengshun",
            zip: "0753"
        },
        {
            label: "凤台Fengtai0554",
            name: "凤台",
            pinyin: "Fengtai",
            zip: "0554"
        },
        {
            label: "丰县Fengxian0516",
            name: "丰县",
            pinyin: "Fengxian",
            zip: "0516"
        },
        {
            label: "奉新Fengxin0795",
            name: "奉新",
            pinyin: "Fengxin",
            zip: "0795"
        },
        {
            label: "凤阳Fengyang0550",
            name: "凤阳",
            pinyin: "Fengyang",
            zip: "0550"
        },
        {
            label: "分宜Fenyi0790",
            name: "分宜",
            pinyin: "Fenyi",
            zip: "0790"
        },
        {
            label: "佛冈Fogang0763",
            name: "佛冈",
            pinyin: "Fogang",
            zip: "0763"
        },
        {
            label: "福安Fuan0593",
            name: "福安",
            pinyin: "Fuan",
            zip: "0593"
        },
        {
            label: "福鼎Fuding0593",
            name: "福鼎",
            pinyin: "Fuding",
            zip: "0593"
        },
        {
            label: "浮梁Fuliang0798",
            name: "浮梁",
            pinyin: "Fuliang",
            zip: "0798"
        },
        {
            label: "富民Fumin0871",
            name: "富民",
            pinyin: "Fumin",
            zip: "0871"
        },
        {
            label: "阜南Funan0558",
            name: "阜南",
            pinyin: "Funan",
            zip: "0558"
        },
        {
            label: "阜宁Funing0515",
            name: "阜宁",
            pinyin: "Funing",
            zip: "0515"
        },
        {
            label: "福清Fuqing0591",
            name: "福清",
            pinyin: "Fuqing",
            zip: "0591"
        },
        {
            label: "富阳Fuyang0571",
            name: "富阳",
            pinyin: "Fuyang",
            zip: "0571"
        },
        {
            label: "赣县Ganxian0797",
            name: "赣县",
            pinyin: "Ganxian",
            zip: "0797"
        },
        {
            label: "赣榆Ganyu0518",
            name: "赣榆",
            pinyin: "Ganyu",
            zip: "0518"
        },
        {
            label: "高安Gaoan0795",
            name: "高安",
            pinyin: "Gaoan",
            zip: "0795"
        },
        {
            label: "藁城Gaocheng0311",
            name: "藁城",
            pinyin: "Gaocheng",
            zip: "0311"
        },
        {
            label: "高淳Gaochun025",
            name: "高淳",
            pinyin: "Gaochun",
            zip: "025"
        },
        {
            label: "皋兰Gaolan0931",
            name: "皋兰",
            pinyin: "Gaolan",
            zip: "0931"
        },
        {
            label: "高陵Gaoling029",
            name: "高陵",
            pinyin: "Gaoling",
            zip: "029"
        },
        {
            label: "高密Gaomi0536",
            name: "高密",
            pinyin: "Gaomi",
            zip: "0536"
        },
        {
            label: "高青Gaoqing0533",
            name: "高青",
            pinyin: "Gaoqing",
            zip: "0533"
        },
        {
            label: "高唐Gaotang0635",
            name: "高唐",
            pinyin: "Gaotang",
            zip: "0635"
        },
        {
            label: "高要Gaoyao0758",
            name: "高要",
            pinyin: "Gaoyao",
            zip: "0758"
        },
        {
            label: "高邑Gaoyi0311",
            name: "高邑",
            pinyin: "Gaoyi",
            zip: "0311"
        },
        {
            label: "高邮Gaoyou0514",
            name: "高邮",
            pinyin: "Gaoyou",
            zip: "0514"
        },
        {
            label: "高州Gaozhou0668",
            name: "高州",
            pinyin: "Gaozhou",
            zip: "0668"
        },
        {
            label: "巩义Gongyi0371",
            name: "巩义",
            pinyin: "Gongyi",
            zip: "0371"
        },
        {
            label: "广昌Guangchang0794",
            name: "广昌",
            pinyin: "Guangchang",
            zip: "0794"
        },
        {
            label: "广德Guangde0563",
            name: "广德",
            pinyin: "Guangde",
            zip: "0563"
        },
        {
            label: "广丰Guangfeng0793",
            name: "广丰",
            pinyin: "Guangfeng",
            zip: "0793"
        },
        {
            label: "广宁Guangning0758",
            name: "广宁",
            pinyin: "Guangning",
            zip: "0758"
        },
        {
            label: "广饶Guangrao0546",
            name: "广饶",
            pinyin: "Guangrao",
            zip: "0546"
        },
        {
            label: "光泽Guangze0599",
            name: "光泽",
            pinyin: "Guangze",
            zip: "0599"
        },
        {
            label: "灌南Guannan0518",
            name: "灌南",
            pinyin: "Guannan",
            zip: "0518"
        },
        {
            label: "冠县Guanxian0635",
            name: "冠县",
            pinyin: "Guanxian",
            zip: "0635"
        },
        {
            label: "灌云Guanyun0518",
            name: "灌云",
            pinyin: "Guanyun",
            zip: "0518"
        },
        {
            label: "贵溪Guixi0701",
            name: "贵溪",
            pinyin: "Guixi",
            zip: "0701"
        },
        {
            label: "古田Gutian0593",
            name: "古田",
            pinyin: "Gutian",
            zip: "0593"
        },
        {
            label: "固镇Guzhen0552",
            name: "固镇",
            pinyin: "Guzhen",
            zip: "0552"
        },
        {
            label: "海安Haian0513",
            name: "海安",
            pinyin: "Haian",
            zip: "0513"
        },
        {
            label: "海丰Haifeng0660",
            name: "海丰",
            pinyin: "Haifeng",
            zip: "0660"
        },
        {
            label: "海门Haimen0513",
            name: "海门",
            pinyin: "Haimen",
            zip: "0513"
        },
        {
            label: "海宁Haining0573",
            name: "海宁",
            pinyin: "Haining",
            zip: "0573"
        },
        {
            label: "海盐Haiyan0573",
            name: "海盐",
            pinyin: "Haiyan",
            zip: "0573"
        },
        {
            label: "海阳Haiyang0535",
            name: "海阳",
            pinyin: "Haiyang",
            zip: "0535"
        },
        {
            label: "含山Hanshan0565",
            name: "含山",
            pinyin: "Hanshan",
            zip: "0565"
        },
        {
            label: "合川Hechuan023",
            name: "合川",
            pinyin: "Hechuan",
            zip: "023"
        },
        {
            label: "横峰Hengfeng0793",
            name: "横峰",
            pinyin: "Hengfeng",
            zip: "0793"
        },
        {
            label: "横县Hengxian0771",
            name: "横县",
            pinyin: "Hengxian",
            zip: "0771"
        },
        {
            label: "和平Heping0762",
            name: "和平",
            pinyin: "Heping",
            zip: "0762"
        },
        {
            label: "鹤山Heshan0750",
            name: "鹤山",
            pinyin: "Heshan",
            zip: "0750"
        },
        {
            label: "和县Hexian0565",
            name: "和县",
            pinyin: "Hexian",
            zip: "0565"
        },
        {
            label: "洪泽Hongze0517",
            name: "洪泽",
            pinyin: "Hongze",
            zip: "0517"
        },
        {
            label: "华安Huaan0596",
            name: "华安",
            pinyin: "Huaan",
            zip: "0596"
        },
        {
            label: "桦甸Huadian0423",
            name: "桦甸",
            pinyin: "Huadian",
            zip: "0423"
        },
        {
            label: "怀集Huaiji0758",
            name: "怀集",
            pinyin: "Huaiji",
            zip: "0758"
        },
        {
            label: "怀宁Huaining0556",
            name: "怀宁",
            pinyin: "Huaining",
            zip: "0556"
        },
        {
            label: "怀远Huaiyuan0552",
            name: "怀远",
            pinyin: "Huaiyuan",
            zip: "0552"
        },
        {
            label: "桓台Huantai0533",
            name: "桓台",
            pinyin: "Huantai",
            zip: "0533"
        },
        {
            label: "化州Huazhou0668",
            name: "化州",
            pinyin: "Huazhou",
            zip: "0668"
        },
        {
            label: "惠安Huian0595",
            name: "惠安",
            pinyin: "Huian",
            zip: "0595"
        },
        {
            label: "会昌Huichang0797",
            name: "会昌",
            pinyin: "Huichang",
            zip: "0797"
        },
        {
            label: "惠东Huidong0752",
            name: "惠东",
            pinyin: "Huidong",
            zip: "0752"
        },
        {
            label: "惠来Huilai0663",
            name: "惠来",
            pinyin: "Huilai",
            zip: "0663"
        },
        {
            label: "惠民Huimin0543",
            name: "惠民",
            pinyin: "Huimin",
            zip: "0543"
        },
        {
            label: "湖口Hukou0792",
            name: "湖口",
            pinyin: "Hukou",
            zip: "0792"
        },
        {
            label: "呼兰Hulan0451",
            name: "呼兰",
            pinyin: "Hulan",
            zip: "0451"
        },
        {
            label: "霍邱Huoqiu0564",
            name: "霍邱",
            pinyin: "Huoqiu",
            zip: "0564"
        },
        {
            label: "霍山Huoshan0564",
            name: "霍山",
            pinyin: "Huoshan",
            zip: "0564"
        },
        {
            label: "户县Huxian029",
            name: "户县",
            pinyin: "Huxian",
            zip: "029"
        },
        {
            label: "建德Jiande0571",
            name: "建德",
            pinyin: "Jiande",
            zip: "0571"
        },
        {
            label: "江都Jiangdu0514",
            name: "江都",
            pinyin: "Jiangdu",
            zip: "0514"
        },
        {
            label: "江津Jiangjin023",
            name: "江津",
            pinyin: "Jiangjin",
            zip: "023"
        },
        {
            label: "将乐Jiangle0598",
            name: "将乐",
            pinyin: "Jiangle",
            zip: "0598"
        },
        {
            label: "江山Jiangshan0570",
            name: "江山",
            pinyin: "Jiangshan",
            zip: "0570"
        },
        {
            label: "姜堰Jiangyan0523",
            name: "姜堰",
            pinyin: "Jiangyan",
            zip: "0523"
        },
        {
            label: "江阴Jiangyin0510",
            name: "江阴",
            pinyin: "Jiangyin",
            zip: "0510"
        },
        {
            label: "建湖Jianhu0515",
            name: "建湖",
            pinyin: "Jianhu",
            zip: "0515"
        },
        {
            label: "建宁Jianning0598",
            name: "建宁",
            pinyin: "Jianning",
            zip: "0598"
        },
        {
            label: "建瓯Jianou0599",
            name: "建瓯",
            pinyin: "Jianou",
            zip: "0599"
        },
        {
            label: "建阳Jianyang0599",
            name: "建阳",
            pinyin: "Jianyang",
            zip: "0599"
        },
        {
            label: "吉安Jian0796",
            name: "吉安",
            pinyin: "Jian",
            zip: "0796"
        },
        {
            label: "蛟河Jiaohe0423",
            name: "蛟河",
            pinyin: "Jiaohe",
            zip: "0423"
        },
        {
            label: "蕉岭Jiaoling0753",
            name: "蕉岭",
            pinyin: "Jiaoling",
            zip: "0753"
        },
        {
            label: "胶南Jiaonan0532",
            name: "胶南",
            pinyin: "Jiaonan",
            zip: "0532"
        },
        {
            label: "胶州Jiaozhou0532",
            name: "胶州",
            pinyin: "Jiaozhou",
            zip: "0532"
        },
        {
            label: "嘉善Jiashan0573",
            name: "嘉善",
            pinyin: "Jiashan",
            zip: "0573"
        },
        {
            label: "嘉祥Jiaxiang0537",
            name: "嘉祥",
            pinyin: "Jiaxiang",
            zip: "0537"
        },
        {
            label: "揭东Jiedong0663",
            name: "揭东",
            pinyin: "Jiedong",
            zip: "0663"
        },
        {
            label: "界首Jieshou0558",
            name: "界首",
            pinyin: "Jieshou",
            zip: "0558"
        },
        {
            label: "揭西Jiexi0663",
            name: "揭西",
            pinyin: "Jiexi",
            zip: "0663"
        },
        {
            label: "即墨Jimo0532",
            name: "即墨",
            pinyin: "Jimo",
            zip: "0532"
        },
        {
            label: "靖安Jingan0795",
            name: "靖安",
            pinyin: "Jingan",
            zip: "0795"
        },
        {
            label: "旌德Jingde0563",
            name: "旌德",
            pinyin: "Jingde",
            zip: "0563"
        },
        {
            label: "井冈山Jinggangshan0796",
            name: "井冈山",
            pinyin: "Jinggangshan",
            zip: "0796"
        },
        {
            label: "靖江Jingjiang0523",
            name: "靖江",
            pinyin: "Jingjiang",
            zip: "0523"
        },
        {
            label: "景宁Jingning0578",
            name: "景宁",
            pinyin: "Jingning",
            zip: "0578"
        },
        {
            label: "泾县Jingxian0563",
            name: "泾县",
            pinyin: "Jingxian",
            zip: "0563"
        },
        {
            label: "井陉Jingxing0311",
            name: "井陉",
            pinyin: "Jingxing",
            zip: "0311"
        },
        {
            label: "金湖Jinhu0517",
            name: "金湖",
            pinyin: "Jinhu",
            zip: "0517"
        },
        {
            label: "晋江Jinjiang0595",
            name: "晋江",
            pinyin: "Jinjiang",
            zip: "0595"
        },
        {
            label: "金门Jinmen0595",
            name: "金门",
            pinyin: "Jinmen",
            zip: "0595"
        },
        {
            label: "晋宁Jinning0871",
            name: "晋宁",
            pinyin: "Jinning",
            zip: "0871"
        },
        {
            label: "金坛Jintan0519",
            name: "金坛",
            pinyin: "Jintan",
            zip: "0519"
        },
        {
            label: "金堂Jintang028",
            name: "金堂",
            pinyin: "Jintang",
            zip: "028"
        },
        {
            label: "进贤Jinxian0791",
            name: "进贤",
            pinyin: "Jinxian",
            zip: "0791"
        },
        {
            label: "金溪Jinxi0794",
            name: "金溪",
            pinyin: "Jinxi",
            zip: "0794"
        },
        {
            label: "金乡Jinxiang0537",
            name: "金乡",
            pinyin: "Jinxiang",
            zip: "0537"
        },
        {
            label: "缙云Jinyun0578",
            name: "缙云",
            pinyin: "Jinyun",
            zip: "0578"
        },
        {
            label: "金寨Jinzhai0564",
            name: "金寨",
            pinyin: "Jinzhai",
            zip: "0564"
        },
        {
            label: "晋州Jinzhou0311",
            name: "晋州",
            pinyin: "Jinzhou",
            zip: "0311"
        },
        {
            label: "吉水Jishui0796",
            name: "吉水",
            pinyin: "Jishui",
            zip: "0796"
        },
        {
            label: "九江Jiujiang0792",
            name: "九江",
            pinyin: "Jiujiang",
            zip: "0792"
        },
        {
            label: "九台Jiutai0431",
            name: "九台",
            pinyin: "Jiutai",
            zip: "0431"
        },
        {
            label: "绩溪Jixi0563",
            name: "绩溪",
            pinyin: "Jixi",
            zip: "0563"
        },
        {
            label: "济阳Jiyang0531",
            name: "济阳",
            pinyin: "Jiyang",
            zip: "0531"
        },
        {
            label: "济源Jiyuan0391",
            name: "济源",
            pinyin: "Jiyuan",
            zip: "0391"
        },
        {
            label: "鄄城Juancheng0530",
            name: "鄄城",
            pinyin: "Juancheng",
            zip: "0530"
        },
        {
            label: "莒南Junan0539",
            name: "莒南",
            pinyin: "Junan",
            zip: "0539"
        },
        {
            label: "句容Jurong0511",
            name: "句容",
            pinyin: "Jurong",
            zip: "0511"
        },
        {
            label: "莒县Juxian0633",
            name: "莒县",
            pinyin: "Juxian",
            zip: "0633"
        },
        {
            label: "巨野Juye0530",
            name: "巨野",
            pinyin: "Juye",
            zip: "0530"
        },
        {
            label: "开化Kaihua0570",
            name: "开化",
            pinyin: "Kaihua",
            zip: "0570"
        },
        {
            label: "开平Kaiping0750",
            name: "开平",
            pinyin: "Kaiping",
            zip: "0750"
        },
        {
            label: "开县Kaixian023",
            name: "开县",
            pinyin: "Kaixian",
            zip: "023"
        },
        {
            label: "开阳Kaiyang0851",
            name: "开阳",
            pinyin: "Kaiyang",
            zip: "0851"
        },
        {
            label: "康平Kangping024",
            name: "康平",
            pinyin: "Kangping",
            zip: "024"
        },
        {
            label: "垦利Kenli0546",
            name: "垦利",
            pinyin: "Kenli",
            zip: "0546"
        },
        {
            label: "昆山Kunshan0512",
            name: "昆山",
            pinyin: "Kunshan",
            zip: "0512"
        },
        {
            label: "来安Laian0550",
            name: "来安",
            pinyin: "Laian",
            zip: "0550"
        },
        {
            label: "莱西Laixi0532",
            name: "莱西",
            pinyin: "Laixi",
            zip: "0532"
        },
        {
            label: "莱阳Laiyang0535",
            name: "莱阳",
            pinyin: "Laiyang",
            zip: "0535"
        },
        {
            label: "莱州Laizhou0535",
            name: "莱州",
            pinyin: "Laizhou",
            zip: "0535"
        },
        {
            label: "郎溪Langxi0563",
            name: "郎溪",
            pinyin: "Langxi",
            zip: "0563"
        },
        {
            label: "蓝田Lantian029",
            name: "蓝田",
            pinyin: "Lantian",
            zip: "029"
        },
        {
            label: "兰溪Lanxi0579",
            name: "兰溪",
            pinyin: "Lanxi",
            zip: "0579"
        },
        {
            label: "乐安Lean0794",
            name: "乐安",
            pinyin: "Lean",
            zip: "0794"
        },
        {
            label: "乐昌Lechang0751",
            name: "乐昌",
            pinyin: "Lechang",
            zip: "0751"
        },
        {
            label: "雷州Leizhou0759",
            name: "雷州",
            pinyin: "Leizhou",
            zip: "0759"
        },
        {
            label: "乐陵Leling0534",
            name: "乐陵",
            pinyin: "Leling",
            zip: "0534"
        },
        {
            label: "乐平Leping0798",
            name: "乐平",
            pinyin: "Leping",
            zip: "0798"
        },
        {
            label: "乐清Leqing0577",
            name: "乐清",
            pinyin: "Leqing",
            zip: "0577"
        },
        {
            label: "乐亭Leting0315",
            name: "乐亭",
            pinyin: "Leting",
            zip: "0315"
        },
        {
            label: "连城Liancheng0597",
            name: "连城",
            pinyin: "Liancheng",
            zip: "0597"
        },
        {
            label: "梁平Liangping023",
            name: "梁平",
            pinyin: "Liangping",
            zip: "023"
        },
        {
            label: "梁山Liangshan0537",
            name: "梁山",
            pinyin: "Liangshan",
            zip: "0537"
        },
        {
            label: "莲花Lianhua0799",
            name: "莲花",
            pinyin: "Lianhua",
            zip: "0799"
        },
        {
            label: "连江Lianjiang0591",
            name: "连江",
            pinyin: "Lianjiang",
            zip: "0591"
        },
        {
            label: "廉江Lianjiang0759",
            name: "廉江",
            pinyin: "Lianjiang",
            zip: "0759"
        },
        {
            label: "连南Liannan0763",
            name: "连南",
            pinyin: "Liannan",
            zip: "0763"
        },
        {
            label: "连平Lianping0762",
            name: "连平",
            pinyin: "Lianping",
            zip: "0762"
        },
        {
            label: "连山Lianshan0763",
            name: "连山",
            pinyin: "Lianshan",
            zip: "0763"
        },
        {
            label: "涟水Lianshui0517",
            name: "涟水",
            pinyin: "Lianshui",
            zip: "0517"
        },
        {
            label: "连州Lianzhou0763",
            name: "连州",
            pinyin: "Lianzhou",
            zip: "0763"
        },
        {
            label: "辽中Liaozhong024",
            name: "辽中",
            pinyin: "Liaozhong",
            zip: "024"
        },
        {
            label: "黎川Lichuan0794",
            name: "黎川",
            pinyin: "Lichuan",
            zip: "0794"
        },
        {
            label: "利津Lijin0546",
            name: "利津",
            pinyin: "Lijin",
            zip: "0546"
        },
        {
            label: "临安Linan0571",
            name: "临安",
            pinyin: "Linan",
            zip: "0571"
        },
        {
            label: "灵璧Lingbi0557",
            name: "灵璧",
            pinyin: "Lingbi",
            zip: "0557"
        },
        {
            label: "灵寿Lingshou0311",
            name: "灵寿",
            pinyin: "Lingshou",
            zip: "0311"
        },
        {
            label: "陵县Lingxian0534",
            name: "陵县",
            pinyin: "Lingxian",
            zip: "0534"
        },
        {
            label: "临海Linhai0576",
            name: "临海",
            pinyin: "Linhai",
            zip: "0576"
        },
        {
            label: "临清Linqing0635",
            name: "临清",
            pinyin: "Linqing",
            zip: "0635"
        },
        {
            label: "临泉Linquan0558",
            name: "临泉",
            pinyin: "Linquan",
            zip: "0558"
        },
        {
            label: "临朐Linqu0536",
            name: "临朐",
            pinyin: "Linqu",
            zip: "0536"
        },
        {
            label: "临沭Linshu0539",
            name: "临沭",
            pinyin: "Linshu",
            zip: "0539"
        },
        {
            label: "临邑Linyi0534",
            name: "临邑",
            pinyin: "Linyi",
            zip: "0534"
        },
        {
            label: "溧水Lishui025",
            name: "溧水",
            pinyin: "Lishui",
            zip: "025"
        },
        {
            label: "柳城Liucheng0772",
            name: "柳城",
            pinyin: "Liucheng",
            zip: "0772"
        },
        {
            label: "柳江Liujiang0772",
            name: "柳江",
            pinyin: "Liujiang",
            zip: "0772"
        },
        {
            label: "浏阳Liuyang0731",
            name: "浏阳",
            pinyin: "Liuyang",
            zip: "0731"
        },
        {
            label: "利辛Lixin0558",
            name: "利辛",
            pinyin: "Lixin",
            zip: "0558"
        },
        {
            label: "溧阳Liyang0519",
            name: "溧阳",
            pinyin: "Liyang",
            zip: "0519"
        },
        {
            label: "隆安Longan0771",
            name: "隆安",
            pinyin: "Longan",
            zip: "0771"
        },
        {
            label: "龙川Longchuan0762",
            name: "龙川",
            pinyin: "Longchuan",
            zip: "0762"
        },
        {
            label: "龙海Longhai0596",
            name: "龙海",
            pinyin: "Longhai",
            zip: "0596"
        },
        {
            label: "龙口Longkou0535",
            name: "龙口",
            pinyin: "Longkou",
            zip: "0535"
        },
        {
            label: "龙门Longmen0752",
            name: "龙门",
            pinyin: "Longmen",
            zip: "0752"
        },
        {
            label: "龙南Longnan0797",
            name: "龙南",
            pinyin: "Longnan",
            zip: "0797"
        },
        {
            label: "龙泉Longquan0578",
            name: "龙泉",
            pinyin: "Longquan",
            zip: "0578"
        },
        {
            label: "龙游Longyou0570",
            name: "龙游",
            pinyin: "Longyou",
            zip: "0570"
        },
        {
            label: "栾城Luancheng0311",
            name: "栾城",
            pinyin: "Luancheng",
            zip: "0311"
        },
        {
            label: "栾川Luanchuan0379",
            name: "栾川",
            pinyin: "Luanchuan",
            zip: "0379"
        },
        {
            label: "滦南Luannan0315",
            name: "滦南",
            pinyin: "Luannan",
            zip: "0315"
        },
        {
            label: "滦县Luanxian0315",
            name: "滦县",
            pinyin: "Luanxian",
            zip: "0315"
        },
        {
            label: "陆丰Lufeng0660",
            name: "陆丰",
            pinyin: "Lufeng",
            zip: "0660"
        },
        {
            label: "陆河Luhe0660",
            name: "陆河",
            pinyin: "Luhe",
            zip: "0660"
        },
        {
            label: "庐江Lujiang0565",
            name: "庐江",
            pinyin: "Lujiang",
            zip: "0565"
        },
        {
            label: "罗定Luoding0766",
            name: "罗定",
            pinyin: "Luoding",
            zip: "0766"
        },
        {
            label: "洛宁Luoning0379",
            name: "洛宁",
            pinyin: "Luoning",
            zip: "0379"
        },
        {
            label: "罗源Luoyuan0591",
            name: "罗源",
            pinyin: "Luoyuan",
            zip: "0591"
        },
        {
            label: "鹿泉Luquan0311",
            name: "鹿泉",
            pinyin: "Luquan",
            zip: "0311"
        },
        {
            label: "禄劝Luquan0871",
            name: "禄劝",
            pinyin: "Luquan",
            zip: "0871"
        },
        {
            label: "芦溪Luxi0799",
            name: "芦溪",
            pinyin: "Luxi",
            zip: "0799"
        },
        {
            label: "鹿寨Luzhai0772",
            name: "鹿寨",
            pinyin: "Luzhai",
            zip: "0772"
        },
        {
            label: "马山Mashan0771",
            name: "马山",
            pinyin: "Mashan",
            zip: "0771"
        },
        {
            label: "梅县Meixian0753",
            name: "梅县",
            pinyin: "Meixian",
            zip: "0753"
        },
        {
            label: "蒙城Mengcheng0558",
            name: "蒙城",
            pinyin: "Mengcheng",
            zip: "0558"
        },
        {
            label: "孟津Mengjin0379",
            name: "孟津",
            pinyin: "Mengjin",
            zip: "0379"
        },
        {
            label: "蒙阴Mengyin0539",
            name: "蒙阴",
            pinyin: "Mengyin",
            zip: "0539"
        },
        {
            label: "孟州Mengzhou0391",
            name: "孟州",
            pinyin: "Mengzhou",
            zip: "0391"
        },
        {
            label: "明光Mingguang0550",
            name: "明光",
            pinyin: "Mingguang",
            zip: "0550"
        },
        {
            label: "明溪Mingxi0598",
            name: "明溪",
            pinyin: "Mingxi",
            zip: "0598"
        },
        {
            label: "闽侯Minhou0591",
            name: "闽侯",
            pinyin: "Minhou",
            zip: "0591"
        },
        {
            label: "闽清Minqing0591",
            name: "闽清",
            pinyin: "Minqing",
            zip: "0591"
        },
        {
            label: "木兰Mulan0451",
            name: "木兰",
            pinyin: "Mulan",
            zip: "0451"
        },
        {
            label: "南安Nanan0595",
            name: "南安",
            pinyin: "Nanan",
            zip: "0595"
        },
        {
            label: "南澳Nanao0754",
            name: "南澳",
            pinyin: "Nanao",
            zip: "0754"
        },
        {
            label: "南城Nancheng0794",
            name: "南城",
            pinyin: "Nancheng",
            zip: "0794"
        },
        {
            label: "南川Nanchuan023",
            name: "南川",
            pinyin: "Nanchuan",
            zip: "023"
        },
        {
            label: "南丰Nanfeng0794",
            name: "南丰",
            pinyin: "Nanfeng",
            zip: "0794"
        },
        {
            label: "南靖Nanjing0596",
            name: "南靖",
            pinyin: "Nanjing",
            zip: "0596"
        },
        {
            label: "南康Nankang0797",
            name: "南康",
            pinyin: "Nankang",
            zip: "0797"
        },
        {
            label: "南陵Nanling0553",
            name: "南陵",
            pinyin: "Nanling",
            zip: "0553"
        },
        {
            label: "南雄Nanxiong0751",
            name: "南雄",
            pinyin: "Nanxiong",
            zip: "0751"
        },
        {
            label: "宁都Ningdu0797",
            name: "宁都",
            pinyin: "Ningdu",
            zip: "0797"
        },
        {
            label: "宁国Ningguo0563",
            name: "宁国",
            pinyin: "Ningguo",
            zip: "0563"
        },
        {
            label: "宁海Ninghai0574",
            name: "宁海",
            pinyin: "Ninghai",
            zip: "0574"
        },
        {
            label: "宁化Ninghua0598",
            name: "宁化",
            pinyin: "Ninghua",
            zip: "0598"
        },
        {
            label: "宁津Ningjin0534",
            name: "宁津",
            pinyin: "Ningjin",
            zip: "0534"
        },
        {
            label: "宁乡Ningxiang0731",
            name: "宁乡",
            pinyin: "Ningxiang",
            zip: "0731"
        },
        {
            label: "宁阳Ningyang0538",
            name: "宁阳",
            pinyin: "Ningyang",
            zip: "0538"
        },
        {
            label: "农安Nongan0431",
            name: "农安",
            pinyin: "Nongan",
            zip: "0431"
        },
        {
            label: "磐安Panan0579",
            name: "磐安",
            pinyin: "Panan",
            zip: "0579"
        },
        {
            label: "磐石Panshi0423",
            name: "磐石",
            pinyin: "Panshi",
            zip: "0423"
        },
        {
            label: "沛县Peixian0516",
            name: "沛县",
            pinyin: "Peixian",
            zip: "0516"
        },
        {
            label: "蓬莱Penglai0535",
            name: "蓬莱",
            pinyin: "Penglai",
            zip: "0535"
        },
        {
            label: "彭水Pengshui023",
            name: "彭水",
            pinyin: "Pengshui",
            zip: "023"
        },
        {
            label: "彭泽Pengze0792",
            name: "彭泽",
            pinyin: "Pengze",
            zip: "0792"
        },
        {
            label: "彭州Pengzhou028",
            name: "彭州",
            pinyin: "Pengzhou",
            zip: "028"
        },
        {
            label: "平度Pingdu0532",
            name: "平度",
            pinyin: "Pingdu",
            zip: "0532"
        },
        {
            label: "平和Pinghe0596",
            name: "平和",
            pinyin: "Pinghe",
            zip: "0596"
        },
        {
            label: "平湖Pinghu0573",
            name: "平湖",
            pinyin: "Pinghu",
            zip: "0573"
        },
        {
            label: "屏南Pingnan0593",
            name: "屏南",
            pinyin: "Pingnan",
            zip: "0593"
        },
        {
            label: "平山Pingshan0311",
            name: "平山",
            pinyin: "Pingshan",
            zip: "0311"
        },
        {
            label: "平潭Pingtan0591",
            name: "平潭",
            pinyin: "Pingtan",
            zip: "0591"
        },
        {
            label: "平阳Pingyang0577",
            name: "平阳",
            pinyin: "Pingyang",
            zip: "0577"
        },
        {
            label: "平阴Pingyin0531",
            name: "平阴",
            pinyin: "Pingyin",
            zip: "0531"
        },
        {
            label: "平邑Pingyi0539",
            name: "平邑",
            pinyin: "Pingyi",
            zip: "0539"
        },
        {
            label: "平原Pingyuan0534",
            name: "平原",
            pinyin: "Pingyuan",
            zip: "0534"
        },
        {
            label: "平远Pingyuan0753",
            name: "平远",
            pinyin: "Pingyuan",
            zip: "0753"
        },
        {
            label: "郫县Pixian028",
            name: "郫县",
            pinyin: "Pixian",
            zip: "028"
        },
        {
            label: "邳州Pizhou0516",
            name: "邳州",
            pinyin: "Pizhou",
            zip: "0516"
        },
        {
            label: "鄱阳Poyang0793",
            name: "鄱阳",
            pinyin: "Poyang",
            zip: "0793"
        },
        {
            label: "浦城Pucheng0599",
            name: "浦城",
            pinyin: "Pucheng",
            zip: "0599"
        },
        {
            label: "浦江Pujiang0579",
            name: "浦江",
            pinyin: "Pujiang",
            zip: "0579"
        },
        {
            label: "蒲江Pujiang028",
            name: "蒲江",
            pinyin: "Pujiang",
            zip: "028"
        },
        {
            label: "普兰店Pulandian0411",
            name: "普兰店",
            pinyin: "Pulandian",
            zip: "0411"
        },
        {
            label: "普宁Puning0663",
            name: "普宁",
            pinyin: "Puning",
            zip: "0663"
        },
        {
            label: "迁安Qianan0315",
            name: "迁安",
            pinyin: "Qianan",
            zip: "0315"
        },
        {
            label: "潜山Qianshan0556",
            name: "潜山",
            pinyin: "Qianshan",
            zip: "0556"
        },
        {
            label: "铅山Qianshan0793",
            name: "铅山",
            pinyin: "Qianshan",
            zip: "0793"
        },
        {
            label: "迁西Qianxi0315",
            name: "迁西",
            pinyin: "Qianxi",
            zip: "0315"
        },
        {
            label: "启东Qidong0513",
            name: "启东",
            pinyin: "Qidong",
            zip: "0513"
        },
        {
            label: "齐河Qihe0534",
            name: "齐河",
            pinyin: "Qihe",
            zip: "0534"
        },
        {
            label: "綦江Qijiang023",
            name: "綦江",
            pinyin: "Qijiang",
            zip: "023"
        },
        {
            label: "祁门Qimen0559",
            name: "祁门",
            pinyin: "Qimen",
            zip: "0559"
        },
        {
            label: "清流Qingliu0598",
            name: "清流",
            pinyin: "Qingliu",
            zip: "0598"
        },
        {
            label: "青田Qingtian0578",
            name: "青田",
            pinyin: "Qingtian",
            zip: "0578"
        },
        {
            label: "清新Qingxin0763",
            name: "清新",
            pinyin: "Qingxin",
            zip: "0763"
        },
        {
            label: "青阳Qingyang0566",
            name: "青阳",
            pinyin: "Qingyang",
            zip: "0566"
        },
        {
            label: "庆元Qingyuan0578",
            name: "庆元",
            pinyin: "Qingyuan",
            zip: "0578"
        },
        {
            label: "庆云Qingyun0534",
            name: "庆云",
            pinyin: "Qingyun",
            zip: "0534"
        },
        {
            label: "清镇Qingzhen0851",
            name: "清镇",
            pinyin: "Qingzhen",
            zip: "0851"
        },
        {
            label: "青州Qingzhou0536",
            name: "青州",
            pinyin: "Qingzhou",
            zip: "0536"
        },
        {
            label: "沁阳Qinyang0391",
            name: "沁阳",
            pinyin: "Qinyang",
            zip: "0391"
        },
        {
            label: "邛崃Qionglai028",
            name: "邛崃",
            pinyin: "Qionglai",
            zip: "028"
        },
        {
            label: "栖霞Qixia0535",
            name: "栖霞",
            pinyin: "Qixia",
            zip: "0535"
        },
        {
            label: "全椒Quanjiao0550",
            name: "全椒",
            pinyin: "Quanjiao",
            zip: "0550"
        },
        {
            label: "全南Quannan0797",
            name: "全南",
            pinyin: "Quannan",
            zip: "0797"
        },
        {
            label: "曲阜Qufu0537",
            name: "曲阜",
            pinyin: "Qufu",
            zip: "0537"
        },
        {
            label: "曲江Qujiang0751",
            name: "曲江",
            pinyin: "Qujiang",
            zip: "0751"
        },
        {
            label: "饶平Raoping0768",
            name: "饶平",
            pinyin: "Raoping",
            zip: "0768"
        },
        {
            label: "仁化Renhua0751",
            name: "仁化",
            pinyin: "Renhua",
            zip: "0751"
        },
        {
            label: "融安Rongan0772",
            name: "融安",
            pinyin: "Rongan",
            zip: "0772"
        },
        {
            label: "荣昌Rongchang023",
            name: "荣昌",
            pinyin: "Rongchang",
            zip: "023"
        },
        {
            label: "荣成Rongcheng0631",
            name: "荣成",
            pinyin: "Rongcheng",
            zip: "0631"
        },
        {
            label: "融水Rongshui0772",
            name: "融水",
            pinyin: "Rongshui",
            zip: "0772"
        },
        {
            label: "如东Rudong0513",
            name: "如东",
            pinyin: "Rudong",
            zip: "0513"
        },
        {
            label: "如皋Rugao0513",
            name: "如皋",
            pinyin: "Rugao",
            zip: "0513"
        },
        {
            label: "瑞安Ruian0577",
            name: "瑞安",
            pinyin: "Ruian",
            zip: "0577"
        },
        {
            label: "瑞昌Ruichang0792",
            name: "瑞昌",
            pinyin: "Ruichang",
            zip: "0792"
        },
        {
            label: "瑞金Ruijin0797",
            name: "瑞金",
            pinyin: "Ruijin",
            zip: "0797"
        },
        {
            label: "乳山Rushan0631",
            name: "乳山",
            pinyin: "Rushan",
            zip: "0631"
        },
        {
            label: "汝阳Ruyang0379",
            name: "汝阳",
            pinyin: "Ruyang",
            zip: "0379"
        },
        {
            label: "乳源Ruyuan0751",
            name: "乳源",
            pinyin: "Ruyuan",
            zip: "0751"
        },
        {
            label: "三江Sanjiang0772",
            name: "三江",
            pinyin: "Sanjiang",
            zip: "0772"
        },
        {
            label: "三门Sanmen0576",
            name: "三门",
            pinyin: "Sanmen",
            zip: "0576"
        },
        {
            label: "诏安Saoan0596",
            name: "诏安",
            pinyin: "Saoan",
            zip: "0596"
        },
        {
            label: "上高Shanggao0795",
            name: "上高",
            pinyin: "Shanggao",
            zip: "0795"
        },
        {
            label: "上杭Shanghang0597",
            name: "上杭",
            pinyin: "Shanghang",
            zip: "0597"
        },
        {
            label: "商河Shanghe0531",
            name: "商河",
            pinyin: "Shanghe",
            zip: "0531"
        },
        {
            label: "上栗Shangli0799",
            name: "上栗",
            pinyin: "Shangli",
            zip: "0799"
        },
        {
            label: "上林Shanglin0771",
            name: "上林",
            pinyin: "Shanglin",
            zip: "0771"
        },
        {
            label: "上饶Shangrao0793",
            name: "上饶",
            pinyin: "Shangrao",
            zip: "0793"
        },
        {
            label: "上犹Shangyou0797",
            name: "上犹",
            pinyin: "Shangyou",
            zip: "0797"
        },
        {
            label: "上虞Shangyu0575",
            name: "上虞",
            pinyin: "Shangyu",
            zip: "0575"
        },
        {
            label: "尚志Shangzhi0451",
            name: "尚志",
            pinyin: "Shangzhi",
            zip: "0451"
        },
        {
            label: "邵武Shaowu0599",
            name: "邵武",
            pinyin: "Shaowu",
            zip: "0599"
        },
        {
            label: "绍兴Shaoxing0575",
            name: "绍兴",
            pinyin: "Shaoxing",
            zip: "0575"
        },
        {
            label: "沙县Shaxian0598",
            name: "沙县",
            pinyin: "Shaxian",
            zip: "0598"
        },
        {
            label: "嵊泗Shengsi0580",
            name: "嵊泗",
            pinyin: "Shengsi",
            zip: "0580"
        },
        {
            label: "嵊州Shengzhou0575",
            name: "嵊州",
            pinyin: "Shengzhou",
            zip: "0575"
        },
        {
            label: "莘县Shenxian0635",
            name: "莘县",
            pinyin: "Shenxian",
            zip: "0635"
        },
        {
            label: "深泽Shenze0311",
            name: "深泽",
            pinyin: "Shenze",
            zip: "0311"
        },
        {
            label: "歙县Shexian0559",
            name: "歙县",
            pinyin: "Shexian",
            zip: "0559"
        },
        {
            label: "射阳Sheyang0515",
            name: "射阳",
            pinyin: "Sheyang",
            zip: "0515"
        },
        {
            label: "石城Shicheng0797",
            name: "石城",
            pinyin: "Shicheng",
            zip: "0797"
        },
        {
            label: "石林Shilin0871",
            name: "石林",
            pinyin: "Shilin",
            zip: "0871"
        },
        {
            label: "石狮Shishi0595",
            name: "石狮",
            pinyin: "Shishi",
            zip: "0595"
        },
        {
            label: "石台Shitai0566",
            name: "石台",
            pinyin: "Shitai",
            zip: "0566"
        },
        {
            label: "始兴Shixing0751",
            name: "始兴",
            pinyin: "Shixing",
            zip: "0751"
        },
        {
            label: "石柱Shizhu023",
            name: "石柱",
            pinyin: "Shizhu",
            zip: "023"
        },
        {
            label: "寿光Shouguang0536",
            name: "寿光",
            pinyin: "Shouguang",
            zip: "0536"
        },
        {
            label: "寿宁Shouning0593",
            name: "寿宁",
            pinyin: "Shouning",
            zip: "0593"
        },
        {
            label: "寿县Shouxian0564",
            name: "寿县",
            pinyin: "Shouxian",
            zip: "0564"
        },
        {
            label: "双城Shuangcheng0451",
            name: "双城",
            pinyin: "Shuangcheng",
            zip: "0451"
        },
        {
            label: "双流Shuangliu028",
            name: "双流",
            pinyin: "Shuangliu",
            zip: "028"
        },
        {
            label: "舒城Shucheng0564",
            name: "舒城",
            pinyin: "Shucheng",
            zip: "0564"
        },
        {
            label: "舒兰Shulan0423",
            name: "舒兰",
            pinyin: "Shulan",
            zip: "0423"
        },
        {
            label: "顺昌Shunchang0599",
            name: "顺昌",
            pinyin: "Shunchang",
            zip: "0599"
        },
        {
            label: "沭阳Shuyang0527",
            name: "沭阳",
            pinyin: "Shuyang",
            zip: "0527"
        },
        {
            label: "泗洪Sihong0527",
            name: "泗洪",
            pinyin: "Sihong",
            zip: "0527"
        },
        {
            label: "四会Sihui0758",
            name: "四会",
            pinyin: "Sihui",
            zip: "0758"
        },
        {
            label: "泗水Sishui0537",
            name: "泗水",
            pinyin: "Sishui",
            zip: "0537"
        },
        {
            label: "泗县Sixian0557",
            name: "泗县",
            pinyin: "Sixian",
            zip: "0557"
        },
        {
            label: "泗阳Siyang0527",
            name: "泗阳",
            pinyin: "Siyang",
            zip: "0527"
        },
        {
            label: "嵩明Songming0871",
            name: "嵩明",
            pinyin: "Songming",
            zip: "0871"
        },
        {
            label: "松溪Songxi0599",
            name: "松溪",
            pinyin: "Songxi",
            zip: "0599"
        },
        {
            label: "嵩县Songxian0379",
            name: "嵩县",
            pinyin: "Songxian",
            zip: "0379"
        },
        {
            label: "松阳Songyang0578",
            name: "松阳",
            pinyin: "Songyang",
            zip: "0578"
        },
        {
            label: "遂昌Suichang0578",
            name: "遂昌",
            pinyin: "Suichang",
            zip: "0578"
        },
        {
            label: "遂川Suichuan0796",
            name: "遂川",
            pinyin: "Suichuan",
            zip: "0796"
        },
        {
            label: "睢宁Suining0516",
            name: "睢宁",
            pinyin: "Suining",
            zip: "0516"
        },
        {
            label: "濉溪Suixi0561",
            name: "濉溪",
            pinyin: "Suixi",
            zip: "0561"
        },
        {
            label: "遂溪Suixi0759",
            name: "遂溪",
            pinyin: "Suixi",
            zip: "0759"
        },
        {
            label: "宿松Susong0556",
            name: "宿松",
            pinyin: "Susong",
            zip: "0556"
        },
        {
            label: "宿豫Suyu0527",
            name: "宿豫",
            pinyin: "Suyu",
            zip: "0527"
        },
        {
            label: "太仓Taicang0512",
            name: "太仓",
            pinyin: "Taicang",
            zip: "0512"
        },
        {
            label: "太和Taihe0558",
            name: "太和",
            pinyin: "Taihe",
            zip: "0558"
        },
        {
            label: "泰和Taihe0796",
            name: "泰和",
            pinyin: "Taihe",
            zip: "0796"
        },
        {
            label: "太湖Taihu0556",
            name: "太湖",
            pinyin: "Taihu",
            zip: "0556"
        },
        {
            label: "泰宁Taining0598",
            name: "泰宁",
            pinyin: "Taining",
            zip: "0598"
        },
        {
            label: "台山Taishan0750",
            name: "台山",
            pinyin: "Taishan",
            zip: "0750"
        },
        {
            label: "泰顺Taishun0577",
            name: "泰顺",
            pinyin: "Taishun",
            zip: "0577"
        },
        {
            label: "泰兴Taixing0523",
            name: "泰兴",
            pinyin: "Taixing",
            zip: "0523"
        },
        {
            label: "郯城Tancheng0539",
            name: "郯城",
            pinyin: "Tancheng",
            zip: "0539"
        },
        {
            label: "唐海Tanghai0315",
            name: "唐海",
            pinyin: "Tanghai",
            zip: "0315"
        },
        {
            label: "滕州Tengzhou0623",
            name: "滕州",
            pinyin: "Tengzhou",
            zip: "0623"
        },
        {
            label: "天长Tianchang0550",
            name: "天长",
            pinyin: "Tianchang",
            zip: "0550"
        },
        {
            label: "天台Tiantai0576",
            name: "天台",
            pinyin: "Tiantai",
            zip: "0576"
        },
        {
            label: "桐城Tongcheng0556",
            name: "桐城",
            pinyin: "Tongcheng",
            zip: "0556"
        },
        {
            label: "铜鼓Tonggu0795",
            name: "铜鼓",
            pinyin: "Tonggu",
            zip: "0795"
        },
        {
            label: "通河Tonghe0451",
            name: "通河",
            pinyin: "Tonghe",
            zip: "0451"
        },
        {
            label: "铜梁Tongliang023",
            name: "铜梁",
            pinyin: "Tongliang",
            zip: "023"
        },
        {
            label: "铜陵Tongling0562",
            name: "铜陵",
            pinyin: "Tongling",
            zip: "0562"
        },
        {
            label: "桐庐Tonglu0571",
            name: "桐庐",
            pinyin: "Tonglu",
            zip: "0571"
        },
        {
            label: "潼南Tongnan023",
            name: "潼南",
            pinyin: "Tongnan",
            zip: "023"
        },
        {
            label: "铜山Tongshan0516",
            name: "铜山",
            pinyin: "Tongshan",
            zip: "0516"
        },
        {
            label: "桐乡Tongxiang0573",
            name: "桐乡",
            pinyin: "Tongxiang",
            zip: "0573"
        },
        {
            label: "通州Tongzhou0513",
            name: "通州",
            pinyin: "Tongzhou",
            zip: "0513"
        },
        {
            label: "瓦房店Wafangdian0411",
            name: "瓦房店",
            pinyin: "Wafangdian",
            zip: "0411"
        },
        {
            label: "万安Wanan0796",
            name: "万安",
            pinyin: "Wanan",
            zip: "0796"
        },
        {
            label: "望城Wangcheng0731",
            name: "望城",
            pinyin: "Wangcheng",
            zip: "0731"
        },
        {
            label: "望江Wangjiang0556",
            name: "望江",
            pinyin: "Wangjiang",
            zip: "0556"
        },
        {
            label: "万年Wannian0793",
            name: "万年",
            pinyin: "Wannian",
            zip: "0793"
        },
        {
            label: "万载Wanzai0795",
            name: "万载",
            pinyin: "Wanzai",
            zip: "0795"
        },
        {
            label: "微山Weishan0537",
            name: "微山",
            pinyin: "Weishan",
            zip: "0537"
        },
        {
            label: "文成Wencheng0577",
            name: "文成",
            pinyin: "Wencheng",
            zip: "0577"
        },
        {
            label: "文登Wendeng0631",
            name: "文登",
            pinyin: "Wendeng",
            zip: "0631"
        },
        {
            label: "翁源Wengyuan0751",
            name: "翁源",
            pinyin: "Wengyuan",
            zip: "0751"
        },
        {
            label: "温岭Wenling0576",
            name: "温岭",
            pinyin: "Wenling",
            zip: "0576"
        },
        {
            label: "汶上Wenshang0537",
            name: "汶上",
            pinyin: "Wenshang",
            zip: "0537"
        },
        {
            label: "温县Wenxian0391",
            name: "温县",
            pinyin: "Wenxian",
            zip: "0391"
        },
        {
            label: "涡阳Woyang0558",
            name: "涡阳",
            pinyin: "Woyang",
            zip: "0558"
        },
        {
            label: "五常Wuchang0451",
            name: "五常",
            pinyin: "Wuchang",
            zip: "0451"
        },
        {
            label: "武城Wucheng0534",
            name: "武城",
            pinyin: "Wucheng",
            zip: "0534"
        },
        {
            label: "吴川Wuchuan0759",
            name: "吴川",
            pinyin: "Wuchuan",
            zip: "0759"
        },
        {
            label: "无棣Wudi0543",
            name: "无棣",
            pinyin: "Wudi",
            zip: "0543"
        },
        {
            label: "五河Wuhe0552",
            name: "五河",
            pinyin: "Wuhe",
            zip: "0552"
        },
        {
            label: "芜湖Wuhu0553",
            name: "芜湖",
            pinyin: "Wuhu",
            zip: "0553"
        },
        {
            label: "五华Wuhua0753",
            name: "五华",
            pinyin: "Wuhua",
            zip: "0753"
        },
        {
            label: "无极Wuji0311",
            name: "无极",
            pinyin: "Wuji",
            zip: "0311"
        },
        {
            label: "吴江Wujiang0512",
            name: "吴江",
            pinyin: "Wujiang",
            zip: "0512"
        },
        {
            label: "五莲Wulian0633",
            name: "五莲",
            pinyin: "Wulian",
            zip: "0633"
        },
        {
            label: "武隆Wulong023",
            name: "武隆",
            pinyin: "Wulong",
            zip: "023"
        },
        {
            label: "武鸣Wuming0771",
            name: "武鸣",
            pinyin: "Wuming",
            zip: "0771"
        },
        {
            label: "武宁Wuning0792",
            name: "武宁",
            pinyin: "Wuning",
            zip: "0792"
        },
        {
            label: "武平Wuping0597",
            name: "武平",
            pinyin: "Wuping",
            zip: "0597"
        },
        {
            label: "巫山Wushan023",
            name: "巫山",
            pinyin: "Wushan",
            zip: "023"
        },
        {
            label: "无为Wuwei0565",
            name: "无为",
            pinyin: "Wuwei",
            zip: "0565"
        },
        {
            label: "巫溪Wuxi023",
            name: "巫溪",
            pinyin: "Wuxi",
            zip: "023"
        },
        {
            label: "武义Wuyi0579",
            name: "武义",
            pinyin: "Wuyi",
            zip: "0579"
        },
        {
            label: "武夷山Wuyishan0599",
            name: "武夷山",
            pinyin: "Wuyishan",
            zip: "0599"
        },
        {
            label: "婺源Wuyuan0793",
            name: "婺源",
            pinyin: "Wuyuan",
            zip: "0793"
        },
        {
            label: "武陟Wuzhi0391",
            name: "武陟",
            pinyin: "Wuzhi",
            zip: "0391"
        },
        {
            label: "峡江Xiajiang0796",
            name: "峡江",
            pinyin: "Xiajiang",
            zip: "0796"
        },
        {
            label: "夏津Xiajin0534",
            name: "夏津",
            pinyin: "Xiajin",
            zip: "0534"
        },
        {
            label: "象山Xiangshan0574",
            name: "象山",
            pinyin: "Xiangshan",
            zip: "0574"
        },
        {
            label: "响水Xiangshui0515",
            name: "响水",
            pinyin: "Xiangshui",
            zip: "0515"
        },
        {
            label: "仙居Xianju0576",
            name: "仙居",
            pinyin: "Xianju",
            zip: "0576"
        },
        {
            label: "仙游Xianyou0594",
            name: "仙游",
            pinyin: "Xianyou",
            zip: "0594"
        },
        {
            label: "萧县Xiaoxian0557",
            name: "萧县",
            pinyin: "Xiaoxian",
            zip: "0557"
        },
        {
            label: "霞浦Xiapu0593",
            name: "霞浦",
            pinyin: "Xiapu",
            zip: "0593"
        },
        {
            label: "息烽Xifeng0851",
            name: "息烽",
            pinyin: "Xifeng",
            zip: "0851"
        },
        {
            label: "新安Xinan0379",
            name: "新安",
            pinyin: "Xinan",
            zip: "0379"
        },
        {
            label: "新昌Xinchang0575",
            name: "新昌",
            pinyin: "Xinchang",
            zip: "0575"
        },
        {
            label: "信丰Xinfeng0797",
            name: "信丰",
            pinyin: "Xinfeng",
            zip: "0797"
        },
        {
            label: "新丰Xinfeng0751",
            name: "新丰",
            pinyin: "Xinfeng",
            zip: "0751"
        },
        {
            label: "新干Xingan0796",
            name: "新干",
            pinyin: "Xingan",
            zip: "0796"
        },
        {
            label: "兴国Xingguo0797",
            name: "兴国",
            pinyin: "Xingguo",
            zip: "0797"
        },
        {
            label: "兴化Xinghua0523",
            name: "兴化",
            pinyin: "Xinghua",
            zip: "0523"
        },
        {
            label: "兴宁Xingning0753",
            name: "兴宁",
            pinyin: "Xingning",
            zip: "0753"
        },
        {
            label: "行唐Xingtang0311",
            name: "行唐",
            pinyin: "Xingtang",
            zip: "0311"
        },
        {
            label: "荥阳Xingyang0371",
            name: "荥阳",
            pinyin: "Xingyang",
            zip: "0371"
        },
        {
            label: "星子Xingzi0792",
            name: "星子",
            pinyin: "Xingzi",
            zip: "0792"
        },
        {
            label: "辛集Xinji0311",
            name: "辛集",
            pinyin: "Xinji",
            zip: "0311"
        },
        {
            label: "新建Xinjian0791",
            name: "新建",
            pinyin: "Xinjian",
            zip: "0791"
        },
        {
            label: "新津Xinjin028",
            name: "新津",
            pinyin: "Xinjin",
            zip: "028"
        },
        {
            label: "新乐Xinle0311",
            name: "新乐",
            pinyin: "Xinle",
            zip: "0311"
        },
        {
            label: "新民Xinmin024",
            name: "新民",
            pinyin: "Xinmin",
            zip: "024"
        },
        {
            label: "新密Xinmi0371",
            name: "新密",
            pinyin: "Xinmi",
            zip: "0371"
        },
        {
            label: "新泰Xintai0538",
            name: "新泰",
            pinyin: "Xintai",
            zip: "0538"
        },
        {
            label: "新兴Xinxing0766",
            name: "新兴",
            pinyin: "Xinxing",
            zip: "0766"
        },
        {
            label: "新沂Xinyi0516",
            name: "新沂",
            pinyin: "Xinyi",
            zip: "0516"
        },
        {
            label: "信宜Xinyi0668",
            name: "信宜",
            pinyin: "Xinyi",
            zip: "0668"
        },
        {
            label: "新郑Xinzheng0371",
            name: "新郑",
            pinyin: "Xinzheng",
            zip: "0371"
        },
        {
            label: "休宁Xiuning0559",
            name: "休宁",
            pinyin: "Xiuning",
            zip: "0559"
        },
        {
            label: "秀山Xiushan023",
            name: "秀山",
            pinyin: "Xiushan",
            zip: "023"
        },
        {
            label: "修水Xiushui0792",
            name: "修水",
            pinyin: "Xiushui",
            zip: "0792"
        },
        {
            label: "修文Xiuwen0851",
            name: "修文",
            pinyin: "Xiuwen",
            zip: "0851"
        },
        {
            label: "修武Xiuwu0391",
            name: "修武",
            pinyin: "Xiuwu",
            zip: "0391"
        },
        {
            label: "寻甸Xundian0871",
            name: "寻甸",
            pinyin: "Xundian",
            zip: "0871"
        },
        {
            label: "寻乌Xunwu0797",
            name: "寻乌",
            pinyin: "Xunwu",
            zip: "0797"
        },
        {
            label: "徐闻Xuwen0759",
            name: "徐闻",
            pinyin: "Xuwen",
            zip: "0759"
        },
        {
            label: "盱眙Xuyi0517",
            name: "盱眙",
            pinyin: "Xuyi",
            zip: "0517"
        },
        {
            label: "阳春Yangchun0662",
            name: "阳春",
            pinyin: "Yangchun",
            zip: "0662"
        },
        {
            label: "阳东Yangdong0662",
            name: "阳东",
            pinyin: "Yangdong",
            zip: "0662"
        },
        {
            label: "阳谷Yanggu0635",
            name: "阳谷",
            pinyin: "Yanggu",
            zip: "0635"
        },
        {
            label: "阳山Yangshan0763",
            name: "阳山",
            pinyin: "Yangshan",
            zip: "0763"
        },
        {
            label: "阳信Yangxin0543",
            name: "阳信",
            pinyin: "Yangxin",
            zip: "0543"
        },
        {
            label: "阳西Yangxi0662",
            name: "阳西",
            pinyin: "Yangxi",
            zip: "0662"
        },
        {
            label: "扬中Yangzhong0511",
            name: "扬中",
            pinyin: "Yangzhong",
            zip: "0511"
        },
        {
            label: "偃师Yanshi0379",
            name: "偃师",
            pinyin: "Yanshi",
            zip: "0379"
        },
        {
            label: "延寿Yanshou0451",
            name: "延寿",
            pinyin: "Yanshou",
            zip: "0451"
        },
        {
            label: "兖州Yanzhou0537",
            name: "兖州",
            pinyin: "Yanzhou",
            zip: "0537"
        },
        {
            label: "伊川Yichuan0379",
            name: "伊川",
            pinyin: "Yichuan",
            zip: "0379"
        },
        {
            label: "宜丰Yifeng0795",
            name: "宜丰",
            pinyin: "Yifeng",
            zip: "0795"
        },
        {
            label: "宜黄Yihuang0794",
            name: "宜黄",
            pinyin: "Yihuang",
            zip: "0794"
        },
        {
            label: "依兰Yilan0451",
            name: "依兰",
            pinyin: "Yilan",
            zip: "0451"
        },
        {
            label: "宜良Yiliang0871",
            name: "宜良",
            pinyin: "Yiliang",
            zip: "0871"
        },
        {
            label: "沂南Yinan0539",
            name: "沂南",
            pinyin: "Yinan",
            zip: "0539"
        },
        {
            label: "英德Yingde0763",
            name: "英德",
            pinyin: "Yingde",
            zip: "0763"
        },
        {
            label: "颍上Yingshang0558",
            name: "颍上",
            pinyin: "Yingshang",
            zip: "0558"
        },
        {
            label: "沂水Yishui0539",
            name: "沂水",
            pinyin: "Yishui",
            zip: "0539"
        },
        {
            label: "义乌Yiwu0579",
            name: "义乌",
            pinyin: "Yiwu",
            zip: "0579"
        },
        {
            label: "黟县Yixian0559",
            name: "黟县",
            pinyin: "Yixian",
            zip: "0559"
        },
        {
            label: "宜兴Yixing0510",
            name: "宜兴",
            pinyin: "Yixing",
            zip: "0510"
        },
        {
            label: "弋阳Yiyang0793",
            name: "弋阳",
            pinyin: "Yiyang",
            zip: "0793"
        },
        {
            label: "宜阳Yiyang0379",
            name: "宜阳",
            pinyin: "Yiyang",
            zip: "0379"
        },
        {
            label: "沂源Yiyuan0533",
            name: "沂源",
            pinyin: "Yiyuan",
            zip: "0533"
        },
        {
            label: "仪征Yizheng0514",
            name: "仪征",
            pinyin: "Yizheng",
            zip: "0514"
        },
        {
            label: "永安Yongan0598",
            name: "永安",
            pinyin: "Yongan",
            zip: "0598"
        },
        {
            label: "永川Yongchuan023",
            name: "永川",
            pinyin: "Yongchuan",
            zip: "023"
        },
        {
            label: "永春Yongchun0595",
            name: "永春",
            pinyin: "Yongchun",
            zip: "0595"
        },
        {
            label: "永登Yongdeng0931",
            name: "永登",
            pinyin: "Yongdeng",
            zip: "0931"
        },
        {
            label: "永定Yongding0597",
            name: "永定",
            pinyin: "Yongding",
            zip: "0597"
        },
        {
            label: "永丰Yongfeng0796",
            name: "永丰",
            pinyin: "Yongfeng",
            zip: "0796"
        },
        {
            label: "永吉Yongji0423",
            name: "永吉",
            pinyin: "Yongji",
            zip: "0423"
        },
        {
            label: "永嘉Yongjia0577",
            name: "永嘉",
            pinyin: "Yongjia",
            zip: "0577"
        },
        {
            label: "永康Yongkang0579",
            name: "永康",
            pinyin: "Yongkang",
            zip: "0579"
        },
        {
            label: "邕宁Yongning0771",
            name: "邕宁",
            pinyin: "Yongning",
            zip: "0771"
        },
        {
            label: "永泰Yongtai0591",
            name: "永泰",
            pinyin: "Yongtai",
            zip: "0591"
        },
        {
            label: "永新Yongxin0796",
            name: "永新",
            pinyin: "Yongxin",
            zip: "0796"
        },
        {
            label: "永修Yongxiu0792",
            name: "永修",
            pinyin: "Yongxiu",
            zip: "0792"
        },
        {
            label: "尤溪Youxi0598",
            name: "尤溪",
            pinyin: "Youxi",
            zip: "0598"
        },
        {
            label: "酉阳Youyang023",
            name: "酉阳",
            pinyin: "Youyang",
            zip: "023"
        },
        {
            label: "元氏Yuanshi0311",
            name: "元氏",
            pinyin: "Yuanshi",
            zip: "0311"
        },
        {
            label: "禹城Yucheng0534",
            name: "禹城",
            pinyin: "Yucheng",
            zip: "0534"
        },
        {
            label: "于都Yudu0797",
            name: "于都",
            pinyin: "Yudu",
            zip: "0797"
        },
        {
            label: "岳西Yuexi0556",
            name: "岳西",
            pinyin: "Yuexi",
            zip: "0556"
        },
        {
            label: "余干Yugan0793",
            name: "余干",
            pinyin: "Yugan",
            zip: "0793"
        },
        {
            label: "玉环Yuhuan0576",
            name: "玉环",
            pinyin: "Yuhuan",
            zip: "0576"
        },
        {
            label: "余江Yujiang0701",
            name: "余江",
            pinyin: "Yujiang",
            zip: "0701"
        },
        {
            label: "郁南Yunan0766",
            name: "郁南",
            pinyin: "Yunan",
            zip: "0766"
        },
        {
            label: "云安Yunan0766",
            name: "云安",
            pinyin: "Yunan",
            zip: "0766"
        },
        {
            label: "郓城Yuncheng0530",
            name: "郓城",
            pinyin: "Yuncheng",
            zip: "0530"
        },
        {
            label: "云和Yunhe0578",
            name: "云和",
            pinyin: "Yunhe",
            zip: "0578"
        },
        {
            label: "云霄Yunxiao0596",
            name: "云霄",
            pinyin: "Yunxiao",
            zip: "0596"
        },
        {
            label: "云阳Yunyang023",
            name: "云阳",
            pinyin: "Yunyang",
            zip: "023"
        },
        {
            label: "玉山Yushan0793",
            name: "玉山",
            pinyin: "Yushan",
            zip: "0793"
        },
        {
            label: "榆树Yushu0431",
            name: "榆树",
            pinyin: "Yushu",
            zip: "0431"
        },
        {
            label: "鱼台Yutai0537",
            name: "鱼台",
            pinyin: "Yutai",
            zip: "0537"
        },
        {
            label: "玉田Yutian0315",
            name: "玉田",
            pinyin: "Yutian",
            zip: "0315"
        },
        {
            label: "余姚Yuyao0574",
            name: "余姚",
            pinyin: "Yuyao",
            zip: "0574"
        },
        {
            label: "榆中Yuzhong0931",
            name: "榆中",
            pinyin: "Yuzhong",
            zip: "0931"
        },
        {
            label: "赞皇Zanhuang0311",
            name: "赞皇",
            pinyin: "Zanhuang",
            zip: "0311"
        },
        {
            label: "增城Zengcheng020",
            name: "增城",
            pinyin: "Zengcheng",
            zip: "020"
        },
        {
            label: "张家港Zhangjiagang0512",
            name: "张家港",
            pinyin: "Zhangjiagang",
            zip: "0512"
        },
        {
            label: "漳平Zhangping0597",
            name: "漳平",
            pinyin: "Zhangping",
            zip: "0597"
        },
        {
            label: "漳浦Zhangpu0596",
            name: "漳浦",
            pinyin: "Zhangpu",
            zip: "0596"
        },
        {
            label: "章丘Zhangqiu0531",
            name: "章丘",
            pinyin: "Zhangqiu",
            zip: "0531"
        },
        {
            label: "樟树Zhangshu0795",
            name: "樟树",
            pinyin: "Zhangshu",
            zip: "0795"
        },
        {
            label: "沾化Zhanhua0543",
            name: "沾化",
            pinyin: "Zhanhua",
            zip: "0543"
        },
        {
            label: "赵县Zhaoxian0311",
            name: "赵县",
            pinyin: "Zhaoxian",
            zip: "0311"
        },
        {
            label: "招远Zhaoyuan0535",
            name: "招远",
            pinyin: "Zhaoyuan",
            zip: "0535"
        },
        {
            label: "正定Zhengding0311",
            name: "正定",
            pinyin: "Zhengding",
            zip: "0311"
        },
        {
            label: "政和Zhenghe0599",
            name: "政和",
            pinyin: "Zhenghe",
            zip: "0599"
        },
        {
            label: "柘荣Zherong0593",
            name: "柘荣",
            pinyin: "Zherong",
            zip: "0593"
        },
        {
            label: "中牟Zhongmou0371",
            name: "中牟",
            pinyin: "Zhongmou",
            zip: "0371"
        },
        {
            label: "忠县Zhongxian023",
            name: "忠县",
            pinyin: "Zhongxian",
            zip: "023"
        },
        {
            label: "周宁Zhouning0593",
            name: "周宁",
            pinyin: "Zhouning",
            zip: "0593"
        },
        {
            label: "周至Zhouzhi029",
            name: "周至",
            pinyin: "Zhouzhi",
            zip: "029"
        },
        {
            label: "庄河Zhuanghe0411",
            name: "庄河",
            pinyin: "Zhuanghe",
            zip: "0411"
        },
        {
            label: "诸城Zhucheng0536",
            name: "诸城",
            pinyin: "Zhucheng",
            zip: "0536"
        },
        {
            label: "诸暨Zhuji0575",
            name: "诸暨",
            pinyin: "Zhuji",
            zip: "0575"
        },
        {
            label: "紫金Zijin0762",
            name: "紫金",
            pinyin: "Zijin",
            zip: "0762"
        },
        {
            label: "资溪Zixi0794",
            name: "资溪",
            pinyin: "Zixi",
            zip: "0794"
        },
        {
            label: "邹城Zoucheng0537",
            name: "邹城",
            pinyin: "Zoucheng",
            zip: "0537"
        },
        {
            label: "邹平Zouping0543",
            name: "邹平",
            pinyin: "Zouping",
            zip: "0543"
        },
        {
            label: "遵化Zunhua0315",
            name: "遵化",
            pinyin: "Zunhua",
            zip: "0315"
        }
    ],
    globalCountries: [
        {
            code: "HK",
            en: "Hong Kong",
            cn: "香港"
        },
        {
            code: "TW",
            en: "Taiwan",
            cn: "台湾"
        },
        {
            code: "MO",
            en: "Macao",
            cn: "澳门"
        },
        {
            code: "US",
            en: "United States of America (USA)",
            cn: "美国"
        },
        {
            code: "AR",
            en: "Argentina",
            cn: "阿根廷"
        },
        {
            code: "AD",
            en: "Andorra",
            cn: "安道尔"
        },
        {
            code: "AE",
            en: "United Arab Emirates",
            cn: "阿联酋"
        },
        {
            code: "AF",
            en: "Afghanistan",
            cn: "阿富汗"
        },
        {
            code: "AG",
            en: "Antigua & Barbuda",
            cn: "安提瓜和巴布达"
        },
        {
            code: "AI",
            en: "Anguilla",
            cn: "安圭拉"
        },
        {
            code: "AL",
            en: "Albania",
            cn: "阿尔巴尼亚"
        },
        {
            code: "AM",
            en: "Armenia",
            cn: "亚美尼亚"
        },
        {
            code: "AO",
            en: "Angola",
            cn: "安哥拉"
        },
        {
            code: "AQ",
            en: "Antarctica",
            cn: "南极洲"
        },
        {
            code: "AS",
            en: "American Samoa",
            cn: "美属萨摩亚"
        },
        {
            code: "AT",
            en: "Austria",
            cn: "奥地利"
        },
        {
            code: "AU",
            en: "Australia",
            cn: "澳大利亚"
        },
        {
            code: "AW",
            en: "Aruba",
            cn: "阿鲁巴"
        },
        {
            code: "AX",
            en: "Aland Island",
            cn: "奥兰群岛"
        },
        {
            code: "AZ",
            en: "Azerbaijan",
            cn: "阿塞拜疆"
        },
        {
            code: "BA",
            en: "Bosnia & Herzegovina",
            cn: "波黑"
        },
        {
            code: "BB",
            en: "Barbados",
            cn: "巴巴多斯"
        },
        {
            code: "BD",
            en: "Bangladesh",
            cn: "孟加拉"
        },
        {
            code: "BE",
            en: "Belgium",
            cn: "比利时"
        },
        {
            code: "BF",
            en: "Burkina",
            cn: "布基纳法索"
        },
        {
            code: "BG",
            en: "Bulgaria",
            cn: "保加利亚"
        },
        {
            code: "BH",
            en: "Bahrain",
            cn: "巴林"
        },
        {
            code: "BI",
            en: "Burundi",
            cn: "布隆迪"
        },
        {
            code: "BJ",
            en: "Benin",
            cn: "贝宁"
        },
        {
            code: "BL",
            en: "Saint Barthélemy",
            cn: "圣巴泰勒米岛"
        },
        {
            code: "BM",
            en: "Bermuda",
            cn: "百慕大"
        },
        {
            code: "BN",
            en: "Brunei",
            cn: "文莱"
        },
        {
            code: "BO",
            en: "Bolivia",
            cn: "玻利维亚"
        },
        {
            code: "BQ",
            en: "Caribbean Netherlands",
            cn: "荷兰加勒比区"
        },
        {
            code: "BR",
            en: "Brazil",
            cn: "巴西"
        },
        {
            code: "BS",
            en: "The Bahamas",
            cn: "巴哈马"
        },
        {
            code: "BT",
            en: "Bhutan",
            cn: "不丹"
        },
        {
            code: "BV",
            en: "Bouvet Island",
            cn: "布韦岛"
        },
        {
            code: "BW",
            en: "Botswana",
            cn: "博茨瓦纳"
        },
        {
            code: "BY",
            en: "Belarus",
            cn: "白俄罗斯"
        },
        {
            code: "BZ",
            en: "Belize",
            cn: "伯利兹"
        },
        {
            code: "CA",
            en: "Canada",
            cn: "加拿大"
        },
        {
            code: "CC",
            en: "Cocos (Keeling) Islands",
            cn: "科科斯群岛"
        },
        {
            code: "CD",
            en: "Democratic Republic of the Congo",
            cn: "刚果（金）"
        },
        {
            code: "CF",
            en: "Central African Republic",
            cn: "中非"
        },
        {
            code: "CG",
            en: "Republic of the Congo",
            cn: "刚果（布）"
        },
        {
            code: "CH",
            en: "Switzerland",
            cn: "瑞士"
        },
        {
            code: "CI",
            en: "Cote d'Ivoire",
            cn: "科特迪瓦"
        },
        {
            code: "CK",
            en: "Cook Islands",
            cn: "库克群岛"
        },
        {
            code: "CL",
            en: "Chile",
            cn: "智利"
        },
        {
            code: "CM",
            en: "Cameroon",
            cn: "喀麦隆"
        },
        {
            code: "CN",
            en: "China",
            cn: "中国"
        },
        {
            code: "CO",
            en: "Colombia",
            cn: "哥伦比亚"
        },
        {
            code: "CR",
            en: "Costa Rica",
            cn: "哥斯达黎加"
        },
        {
            code: "CU",
            en: "Cuba",
            cn: "古巴"
        },
        {
            code: "CV",
            en: "Cape Verde",
            cn: "佛得角"
        },
        {
            code: "CW",
            en: "Curacao",
            cn: "库拉索"
        },
        {
            code: "CX",
            en: "Christmas Island",
            cn: "圣诞岛"
        },
        {
            code: "CY",
            en: "Cyprus",
            cn: "塞浦路斯"
        },
        {
            code: "CZ",
            en: "Czech Republic",
            cn: "捷克"
        },
        {
            code: "DE",
            en: "Germany",
            cn: "德国"
        },
        {
            code: "DJ",
            en: "Djibouti",
            cn: "吉布提"
        },
        {
            code: "DK",
            en: "Denmark",
            cn: "丹麦"
        },
        {
            code: "DM",
            en: "Dominica",
            cn: "多米尼克"
        },
        {
            code: "DO",
            en: "Dominican Republic",
            cn: "多米尼加"
        },
        {
            code: "DZ",
            en: "Algeria",
            cn: "阿尔及利亚"
        },
        {
            code: "EC",
            en: "Ecuador",
            cn: "厄瓜多尔"
        },
        {
            code: "EE",
            en: "Estonia",
            cn: "爱沙尼亚"
        },
        {
            code: "EG",
            en: "Egypt",
            cn: "埃及"
        },
        {
            code: "EH",
            en: "Western Sahara",
            cn: "西撒哈拉"
        },
        {
            code: "ER",
            en: "Eritrea",
            cn: "厄立特里亚"
        },
        {
            code: "ES",
            en: "Spain",
            cn: "西班牙"
        },
        {
            code: "ET",
            en: "Ethiopia",
            cn: "埃塞俄比亚"
        },
        {
            code: "FI",
            en: "Finland",
            cn: "芬兰"
        },
        {
            code: "FJ",
            en: "Fiji",
            cn: "斐济群岛"
        },
        {
            code: "FK",
            en: "Falkland Islands",
            cn: "马尔维纳斯群岛（福克兰）"
        },
        {
            code: "FM",
            en: "Federated States of Micronesia",
            cn: "密克罗尼西亚联邦"
        },
        {
            code: "FO",
            en: "Faroe Islands",
            cn: "法罗群岛"
        },
        {
            code: "FR",
            en: "France",
            cn: "法国 法国"
        },
        {
            code: "GA",
            en: "Gabon",
            cn: "加蓬"
        },
        {
            code: "GB",
            en: "Great Britain (United Kingdom; England)",
            cn: "英国"
        },
        {
            code: "GD",
            en: "Grenada",
            cn: "格林纳达"
        },
        {
            code: "GE",
            en: "Georgia",
            cn: "格鲁吉亚"
        },
        {
            code: "GF",
            en: "French Guiana",
            cn: "法属圭亚那"
        },
        {
            code: "GG",
            en: "Guernsey",
            cn: "根西岛"
        },
        {
            code: "GH",
            en: "Ghana",
            cn: "加纳"
        },
        {
            code: "GI",
            en: "Gibraltar",
            cn: "直布罗陀"
        },
        {
            code: "GL",
            en: "Greenland",
            cn: "格陵兰"
        },
        {
            code: "GM",
            en: "Gambia",
            cn: "冈比亚"
        },
        {
            code: "GN",
            en: "Guinea",
            cn: "几内亚"
        },
        {
            code: "GP",
            en: "Guadeloupe",
            cn: "瓜德罗普"
        },
        {
            code: "GQ",
            en: "Equatorial Guinea",
            cn: "赤道几内亚"
        },
        {
            code: "GR",
            en: "Greece",
            cn: "希腊"
        },
        {
            code: "GS",
            en: "South Georgia and the South Sandwich Islands",
            cn: "南乔治亚岛和南桑威奇群岛"
        },
        {
            code: "GT",
            en: "Guatemala",
            cn: "危地马拉"
        },
        {
            code: "GU",
            en: "Guam",
            cn: "关岛"
        },
        {
            code: "GW",
            en: "Guinea-Bissau",
            cn: "几内亚比绍"
        },
        {
            code: "GY",
            en: "Guyana",
            cn: "圭亚那"
        },
        {
            code: "HM",
            en: "Heard Island and McDonald Islands",
            cn: "赫德岛和麦克唐纳群岛"
        },
        {
            code: "HN",
            en: "Honduras",
            cn: "洪都拉斯"
        },
        {
            code: "HR",
            en: "Croatia",
            cn: "克罗地亚"
        },
        {
            code: "HT",
            en: "Haiti",
            cn: "海地"
        },
        {
            code: "HU",
            en: "Hungary",
            cn: "匈牙利"
        },
        {
            code: "ID",
            en: "Indonesia",
            cn: "印尼"
        },
        {
            code: "IE",
            en: "Ireland",
            cn: "爱尔兰"
        },
        {
            code: "IL",
            en: "Israel",
            cn: "以色列"
        },
        {
            code: "IM",
            en: "Isle of Man",
            cn: "马恩岛"
        },
        {
            code: "IN",
            en: "India",
            cn: "印度"
        },
        {
            code: "IO",
            en: "British Indian Ocean Territory",
            cn: "英属印度洋领地"
        },
        {
            code: "IQ",
            en: "Iraq",
            cn: "伊拉克"
        },
        {
            code: "IR",
            en: "Iran",
            cn: "伊朗"
        },
        {
            code: "IS",
            en: "Iceland",
            cn: "冰岛"
        },
        {
            code: "IT",
            en: "Italy",
            cn: "意大利"
        },
        {
            code: "JE",
            en: "Jersey",
            cn: "泽西岛"
        },
        {
            code: "JM",
            en: "Jamaica",
            cn: "牙买加"
        },
        {
            code: "JO",
            en: "Jordan",
            cn: "约旦"
        },
        {
            code: "JP",
            en: "Japan",
            cn: "日本"
        },
        {
            code: "KE",
            en: "Kenya",
            cn: "肯尼亚"
        },
        {
            code: "KG",
            en: "Kyrgyzstan",
            cn: "吉尔吉斯斯坦"
        },
        {
            code: "KH",
            en: "Cambodia",
            cn: "柬埔寨"
        },
        {
            code: "KI",
            en: "Kiribati",
            cn: "基里巴斯"
        },
        {
            code: "KM",
            en: "The Comoros",
            cn: "科摩罗"
        },
        {
            code: "KN",
            en: "St. Kitts & Nevis",
            cn: "圣基茨和尼维斯"
        },
        {
            code: "KP",
            en: "North Korea",
            cn: "朝鲜"
        },
        {
            code: "KR",
            en: "South Korea",
            cn: "韩国"
        },
        {
            code: "KW",
            en: "Kuwait",
            cn: "科威特"
        },
        {
            code: "KY",
            en: "Cayman Islands",
            cn: "开曼群岛"
        },
        {
            code: "KZ",
            en: "Kazakhstan",
            cn: "哈萨克斯坦"
        },
        {
            code: "LA",
            en: "Laos",
            cn: "老挝"
        },
        {
            code: "LB",
            en: "Lebanon",
            cn: "黎巴嫩"
        },
        {
            code: "LC",
            en: "St. Lucia",
            cn: "圣卢西亚"
        },
        {
            code: "LI",
            en: "Liechtenstein",
            cn: "列支敦士登"
        },
        {
            code: "LK",
            en: "Sri Lanka",
            cn: "斯里兰卡"
        },
        {
            code: "LR",
            en: "Liberia",
            cn: "利比里亚"
        },
        {
            code: "LS",
            en: "Lesotho",
            cn: "莱索托"
        },
        {
            code: "LT",
            en: "Lithuania",
            cn: "立陶宛"
        },
        {
            code: "LU",
            en: "Luxembourg",
            cn: "卢森堡"
        },
        {
            code: "LV",
            en: "Latvia",
            cn: "拉脱维亚"
        },
        {
            code: "LY",
            en: "Libya",
            cn: "利比亚"
        },
        {
            code: "MA",
            en: "Morocco",
            cn: "摩洛哥"
        },
        {
            code: "MC",
            en: "Monaco",
            cn: "摩纳哥"
        },
        {
            code: "MD",
            en: "Moldova",
            cn: "摩尔多瓦"
        },
        {
            code: "ME",
            en: "Montenegro",
            cn: "黑山"
        },
        {
            code: "MF",
            en: "Saint Martin (France)",
            cn: "法属圣马丁"
        },
        {
            code: "MG",
            en: "Madagascar",
            cn: "马达加斯加"
        },
        {
            code: "MH",
            en: "Marshall islands",
            cn: "马绍尔群岛"
        },
        {
            code: "MK",
            en: "Republic of Macedonia (FYROM)",
            cn: "马其顿"
        },
        {
            code: "ML",
            en: "Mali",
            cn: "马里"
        },
        {
            code: "MM",
            en: "Myanmar (Burma)",
            cn: "缅甸"
        },
        {
            code: "MN",
            en: "Mongolia",
            cn: "蒙古国"
        },
        {
            code: "MP",
            en: "Northern Mariana Islands",
            cn: "北马里亚纳群岛"
        },
        {
            code: "MQ",
            en: "Martinique",
            cn: "马提尼克"
        },
        {
            code: "MR",
            en: "Mauritania",
            cn: "毛里塔尼亚"
        },
        {
            code: "MS",
            en: "Montserrat",
            cn: "蒙塞拉特岛"
        },
        {
            code: "MT",
            en: "Malta",
            cn: "马耳他"
        },
        {
            code: "MU",
            en: "Mauritius",
            cn: "毛里求斯"
        },
        {
            code: "MV",
            en: "Maldives",
            cn: "马尔代夫"
        },
        {
            code: "MW",
            en: "Malawi",
            cn: "马拉维"
        },
        {
            code: "MX",
            en: "Mexico",
            cn: "墨西哥"
        },
        {
            code: "MY",
            en: "Malaysia",
            cn: "马来西亚"
        },
        {
            code: "MZ",
            en: "Mozambique",
            cn: "莫桑比克"
        },
        {
            code: "NA",
            en: "Namibia",
            cn: "纳米比亚"
        },
        {
            code: "NC",
            en: "New Caledonia",
            cn: "新喀里多尼亚"
        },
        {
            code: "NE",
            en: "Niger",
            cn: "尼日尔"
        },
        {
            code: "NF",
            en: "Norfolk Island",
            cn: "诺福克岛"
        },
        {
            code: "NG",
            en: "Nigeria",
            cn: "尼日利亚"
        },
        {
            code: "NI",
            en: "Nicaragua",
            cn: "尼加拉瓜"
        },
        {
            code: "NL",
            en: "Netherlands",
            cn: "荷兰"
        },
        {
            code: "NO",
            en: "Norway",
            cn: "挪威"
        },
        {
            code: "NP",
            en: "Nepal",
            cn: "尼泊尔"
        },
        {
            code: "NR",
            en: "Nauru",
            cn: "瑙鲁"
        },
        {
            code: "NU",
            en: "Niue",
            cn: "纽埃"
        },
        {
            code: "NZ",
            en: "New Zealand",
            cn: "新西兰"
        },
        {
            code: "OM",
            en: "Oman",
            cn: "阿曼"
        },
        {
            code: "PA",
            en: "Panama",
            cn: "巴拿马"
        },
        {
            code: "PE",
            en: "Peru",
            cn: "秘鲁"
        },
        {
            code: "PF",
            en: "French polynesia",
            cn: "法属波利尼西亚"
        },
        {
            code: "PG",
            en: "Papua New Guinea",
            cn: "巴布亚新几内亚"
        },
        {
            code: "PH",
            en: "The Philippines",
            cn: "菲律宾"
        },
        {
            code: "PK",
            en: "Pakistan",
            cn: "巴基斯坦"
        },
        {
            code: "PL",
            en: "Poland",
            cn: "波兰"
        },
        {
            code: "PM",
            en: "Saint-Pierre and Miquelon",
            cn: "圣皮埃尔和密克隆"
        },
        {
            code: "PN",
            en: "Pitcairn Islands",
            cn: "皮特凯恩群岛"
        },
        {
            code: "PR",
            en: "Puerto Rico",
            cn: "波多黎各"
        },
        {
            code: "PS",
            en: "Palestinian territories",
            cn: "巴勒斯坦"
        },
        {
            code: "PT",
            en: "Portugal",
            cn: "葡萄牙"
        },
        {
            code: "PW",
            en: "Palau",
            cn: "帕劳"
        },
        {
            code: "PY",
            en: "Paraguay",
            cn: "巴拉圭"
        },
        {
            code: "QA",
            en: "Qatar",
            cn: "卡塔尔"
        },
        {
            code: "RE",
            en: "Réunion",
            cn: "留尼汪"
        },
        {
            code: "RO",
            en: "Romania",
            cn: "罗马尼亚"
        },
        {
            code: "RS",
            en: "Serbia",
            cn: "塞尔维亚"
        },
        {
            code: "RU",
            en: "Russian Federation",
            cn: "俄罗斯"
        },
        {
            code: "RW",
            en: "Rwanda",
            cn: "卢旺达"
        },
        {
            code: "SA",
            en: "Saudi Arabia",
            cn: "沙特阿拉伯"
        },
        {
            code: "SB",
            en: "Solomon Islands",
            cn: "所罗门群岛"
        },
        {
            code: "SC",
            en: "Seychelles",
            cn: "塞舌尔"
        },
        {
            code: "SD",
            en: "Sudan",
            cn: "苏丹"
        },
        {
            code: "SE",
            en: "Sweden",
            cn: "瑞典"
        },
        {
            code: "SG",
            en: "Singapore",
            cn: "新加坡"
        },
        {
            code: "SH",
            en: "St. Helena & Dependencies",
            cn: "圣赫勒拿"
        },
        {
            code: "SI",
            en: "Slovenia",
            cn: "斯洛文尼亚"
        },
        {
            code: "SJ",
            en: "Svalbard and Jan Mayen",
            cn: "斯瓦尔巴群岛和扬马延岛"
        },
        {
            code: "SK",
            en: "Slovakia",
            cn: "斯洛伐克"
        },
        {
            code: "SL",
            en: "Sierra Leone",
            cn: "塞拉利昂"
        },
        {
            code: "SM",
            en: "San Marino",
            cn: "圣马力诺"
        },
        {
            code: "SN",
            en: "Senegal",
            cn: "塞内加尔"
        },
        {
            code: "SO",
            en: "Somalia",
            cn: "索马里"
        },
        {
            code: "SR",
            en: "Suriname",
            cn: "苏里南"
        },
        {
            code: "SS",
            en: "South Sudan",
            cn: "南苏丹"
        },
        {
            code: "ST",
            en: "Sao Tome & Principe",
            cn: "圣多美和普林西比"
        },
        {
            code: "SV",
            en: "El Salvador",
            cn: "萨尔瓦多"
        },
        {
            code: "SX",
            en: "Sint Maarten",
            cn: "荷属圣马丁"
        },
        {
            code: "SY",
            en: "Syria",
            cn: "叙利亚"
        },
        {
            code: "SZ",
            en: "Swaziland",
            cn: "斯威士兰"
        },
        {
            code: "TC",
            en: "Turks & Caicos Islands",
            cn: "特克斯和凯科斯群岛"
        },
        {
            code: "TD",
            en: "Chad",
            cn: "乍得"
        },
        {
            code: "TF",
            en: "French Southern Territories",
            cn: "法属南部领地"
        },
        {
            code: "TG",
            en: "Togo",
            cn: "多哥"
        },
        {
            code: "TH",
            en: "Thailand",
            cn: "泰国"
        },
        {
            code: "TJ",
            en: "Tajikistan",
            cn: "塔吉克斯坦"
        },
        {
            code: "TK",
            en: "Tokelau",
            cn: "托克劳"
        },
        {
            code: "TL",
            en: "Timor-Leste (East Timor)",
            cn: "东帝汶"
        },
        {
            code: "TM",
            en: "Turkmenistan",
            cn: "土库曼斯坦"
        },
        {
            code: "TN",
            en: "Tunisia",
            cn: "突尼斯"
        },
        {
            code: "TO",
            en: "Tonga",
            cn: "汤加"
        },
        {
            code: "TR",
            en: "Turkey",
            cn: "土耳其"
        },
        {
            code: "TT",
            en: "Trinidad & Tobago",
            cn: "特立尼达和多巴哥"
        },
        {
            code: "TV",
            en: "Tuvalu",
            cn: "图瓦卢"
        },
        {
            code: "TZ",
            en: "Tanzania",
            cn: "坦桑尼亚"
        },
        {
            code: "UA",
            en: "Ukraine",
            cn: "乌克兰"
        },
        {
            code: "UG",
            en: "Uganda",
            cn: "乌干达"
        },
        {
            code: "UM",
            en: "United States Minor Outlying Islands",
            cn: "美国本土外小岛屿"
        },
        {
            code: "UY",
            en: "Uruguay",
            cn: "乌拉圭"
        },
        {
            code: "UZ",
            en: "Uzbekistan",
            cn: "乌兹别克斯坦"
        },
        {
            code: "VA",
            en: "Vatican City (The Holy See)",
            cn: "梵蒂冈"
        },
        {
            code: "VC",
            en: "St. Vincent & the Grenadines",
            cn: "圣文森特和格林纳丁斯"
        },
        {
            code: "VE",
            en: "Venezuela",
            cn: "委内瑞拉"
        },
        {
            code: "VG",
            en: "British Virgin Islands",
            cn: "英属维尔京群岛"
        },
        {
            code: "VI",
            en: "United States Virgin Islands",
            cn: "美属维尔京群岛"
        },
        {
            code: "VN",
            en: "Vietnam",
            cn: "越南"
        },
        {
            code: "VU",
            en: "Vanuatu",
            cn: "瓦努阿图"
        },
        {
            code: "WF",
            en: "Wallis and Futuna",
            cn: "瓦利斯和富图纳"
        },
        {
            code: "WS",
            en: "Samoa",
            cn: "萨摩亚"
        },
        {
            code: "YE",
            en: "Yemen",
            cn: "也门"
        },
        {
            code: "YT",
            en: "Mayotte",
            cn: "马约特"
        },
        {
            code: "ZA",
            en: "South Africa",
            cn: "南非"
        },
        {
            code: "ZM",
            en: "Zambia",
            cn: "赞比亚"
        },
        {
            code: "ZW",
            en: "Zimbabwe",
            cn: "津巴布韦"
        }
    ],
    bool: function () {
        return parseInt(getRandom(10)) % 2 ? true : false;

    },
    city: function () {
        var index = Math.floor(getRandom(this.chineseCities.length));
        return this.chineseCities[index].name;
    },
    country: function () {
        var index = Math.floor(getRandom(this.globalCountries.length));
        return this.globalCountries[index].cn;
    },
    date: function (min, max) {
        min = min || Date.now();
        max = max || min;
        return new Date(min + getRandom(max - min)).toString();
    },
    floating: function (min, max, fixed) {
        fixed = fixed || 2;
        if (max == null) {
            max = min;
            min = 0;
        }
        return getRandom(min, max).toFixed(fixed);
    },
    integer: function (min, max) {
        if (max == null) {
            max = min || 100;
            min = 0;
        }
        return Math.floor(getRandom(min, max));
    },

    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    range: function (count) {
        count = count || 1;
        return Array.apply(null, {
            length: count
        }).map(function (value, index, array) {
            return index;
        });
    },

    phone: function () {
        var result = "1";
        var code = [31, 32, 33, 34, 35, 36, 37, 38, 39, 47, 52, 82, 83, 87, 88, 89];
        result += code[parseInt(getRandom(code.length))];

        result += Array.apply(null, {
            length: 8
        }).map(function (value, index, array) {
            return Math.floor(getRandom(10));
        }).join("");
    },

    objectId: function () {
        return ObjectId();
    },

    text: function (count, type) {
        type = type || "zh";
        switch (type) {
            case "zh":
                {
                    count = count > this.chinese.length ? this.chinese.length : count;
                    var start = parseInt(getRandom(this.chinese.length - count));
                    return this.chinese.substr(start, count);
                    break;
                }
            default:
                {
                    count = count > this.english.length ? this.english.length : count;
                    var start = parseInt(getRandom(this.english.length - count));
                    return this.english.substr(start, count);
                }
        }
    },
    chinese: '项脊轩，旧南阁子也。室仅方丈，可容一人居。百年老屋，尘泥渗漉，雨泽下注；每移案，顾视无可置者。又北向，不能得日，日过午已昏。余稍为修葺，使不上漏。前辟四窗，垣墙周庭，以当南日，日影反照，室始洞然。又杂植兰桂竹木于庭，旧时栏，亦遂增胜。借书满架，偃仰啸歌，冥然兀坐，万簌有声；而庭阶寂寂，小鸟时来啄食，人至不去。三五之夜，明月半墙，桂影斑驳，风移影动，珊珊可爱。然余居于此，多可喜，亦多可悲。先是，庭中通南北为一。迨诸父异爨，内外多置小门，墙往往而是。东犬西吠，客逾庖而宴，鸡栖于厅。庭中始为篱，已为墙，凡再变矣。家有老妪，尝居于此。妪，先大母婢也，乳二世，先妣抚之甚厚。室西连于中闺，先妣尝一至，妪每谓余曰：“某所，而母立于兹。”妪又曰：“汝姊在吾怀，呱呱而泣；娘以指叩门扉曰：‘儿寒乎？欲食乎？’吾从板外相为应答。”语未毕，余泣，妪也泣。余自束发读书轩中，一日，大母过余曰：“吾儿，久不见若影，何竟日默默在此，大类女郎也？”比去，以手阖门，自语曰：“吾家读书久不效，儿之成，则可待乎！”顷之，持一象笏至，曰：“此吾祖太常公宣德间执此以朝，他日汝当用之！”瞻顾遗迹，如在昨日，令人长号不自禁。轩东故尝为厨，人往，从轩前过。余扃牖而居，久之，能以足音辨人。轩凡四遭火，得不焚，殆有神护者。…… 余既为此志，后五年，吾妻来归，时至轩中，从余问古事，或凭几学书。 吾妻归宁，述诸小妹语曰：“闻姊家有阁子，且何谓阁子也？”其后六年，吾妻死，室坏不修。其后二年，余久卧病无聊，乃使人复葺南阁子，其制稍异于前。然自后余多在外，不常居。庭有枇杷树，吾妻死之年所手植也，今已亭亭如盖矣。',
    english: 'I have a dream that one day this nation will rise up and live out the true meaning of its creed: "We hold these truths to be self-evident, that all men are created equal."I have a dream that one day on the red hills of Georgia, the sons of former slaves and the sons of former slave owners will be able to sit down together at the table of brotherhood. I have a dream that one day even the state of Mississippi, a state sweltering with the heat of injustice, sweltering with the heat of oppression, will be transformed into an oasis of freedom and justice. I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character. I have a dream today! I have a dream that one day, down in Alabama, with its vicious racists, with its governor having his lips dripping with the words of "interposition" and "nullification" -- one day right there in Alabama little black boys and black girls will be able to join hands with little white boys and white girls as sisters and brothers. I have a dream today! I have a dream that one day every valley shall be exalted, and every hill and mountain shall be made low, the rough places will be made plain, and the crooked places will be made straight; "and the glory of the Lord shall be revealed and all flesh shall see it together."2 This is our hope, and this is the faith that I go back to the South with. With this faith, we will be able to hew out of the mountain of despair a stone of hope. With this faith, we will be able to transform the jangling discords of our nation into a beautiful symphony of brotherhood. With this faith, we will be able to work together, to pray together, to struggle together, to go to jail together, to stand up for freedom together, knowing that we will be free one day.'
}

