var $ = document.querySelectorAll.bind(document),
    $$ = document.querySelector.bind(document);
function Lock(args) {
    this.container = args.container || "lock";
    this.width = args.width;
    this.height = args.height;
    this.padding = args.padding || 10;
    this.pos = [];
    this.radius = null;
    this.pointRadius = null;
    this.track = [];
    this.track_backup = null;
    this.isEnd = false;
    for (var i = 0; i < 3; i++) {
        this.pos[i] = new Array(3);
    }
}


Lock.prototype.init = function () {
    this.canvas = document.getElementById(this.container);
    var context = this.context = this.canvas.getContext('2d'),
        gapX = this.gapX = this.width / 3,
        gapY = this.gapY = this.height / 3;

    this.radius = this.min(gapX, gapY) / 2 - this.padding;
    this.pointRadius = 15;
    this.mode = $$(".input-group input:checked").value;
    $(".input-group input").forEach(function (ele) {
        ele.addEventListener("click", function (e) {
            self.mode = e.target.value;
        }, true);
    });
    var self = this;
    this.drawCircle();

    this.canvas.addEventListener("touchstart", function (e) {
        var relativePos = self.getRelativePos(e);
        self.isEnd = false;
        self.track = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (self.getDis(relativePos, self.pos[i][j]) <= self.radius) {
                    self.drawPoint(self.pos[i][j]);
                    self.track.push((self.pos[i][j]));
                }
            }
        }

    });

    this.canvas.addEventListener("touchmove", function (e) {
        var relativePos = self.getRelativePos(e);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (self.getDis(relativePos, self.pos[i][j]) <= self.radius) {
                    self.drawPoint(self.pos[i][j]);
                    var latest = self.track.pop();
                    self.track.push(latest);
                    if (latest.x !== self.pos[i][j].x || latest.y !== self.pos[i][j].y) self.track.push(self.pos[i][j]); // 防止重复添加track

                }
            }
        }
        self.updateTrack(relativePos);
    }, false);

    this.canvas.addEventListener("touchend", function (e) {
        self.isEnd = true;
        if (self.mode == "0") {// 设置密码
            if (self.track.length < 5) {
                $$("#message").innerText = "密码最少5位，请重新设置。";
                self.track = [];
            } else {
                if (!self.track_backup) {
                    self.track_backup = self.track;
                    self.track = [];
                    $$("#message").innerText = "请确认密码";
                } else {
                    if (self.isTrackEqual(self.track_backup, self.track)) { // 轨迹相等
                        localStorage.setItem("password", JSON.stringify(self.track));
                        $$("#message").innerText = "密码设置成功。";
                    } else {
                        $$("#message").innerText = "两次输入不一致，请重新录入密码。";
                    }
                    self.track_backup = null;
                    self.track = [];
                }

            }
        } else {
            var password = JSON.parse(localStorage.getItem("password"));
            if (self.isTrackEqual(password, self.track)) {
                $$("#message").innerText = "验证成功！";
            } else {
                $$("#message").innerText = "验证失败！";
            }
            self.track = [];
        }
        self.updateTrack();
    });
}

Lock.prototype.min = function (a, b) {
    return a > b ? b : a;
}

/**
 * @desc 返回点击位置相对于canvas的坐标
 * @param  {} e
 */
Lock.prototype.getRelativePos = function (e) {
    var currentPos = e.currentTarget.getBoundingClientRect();
    return {
        x: e.touches[0].clientX - currentPos.left,
        y: e.touches[0].clientY - currentPos.top
    };
}

/**
 * @desc 比较两条轨迹是否相等
 * @param [] trackA
 * @param [] trackB
 */
Lock.prototype.isTrackEqual = function (trackA, trackB) {
    if (trackA.length !== trackB.length) return false;
    var result = true;
    for (var i = 0; i < trackA.length; i++) {
        result = result && trackA[i].x == trackB[i].x && trackA[i].y == trackB[i].y;
    }
    return result;
}

/**
 * @desc 返回两点之间距离
 * @param  {} pointA
 * @param  {} pointB
 */
Lock.prototype.getDis = function (pointA, pointB) {
    return Math.sqrt(Math.pow(Math.abs(pointA.x - pointB.x), 2) + Math.pow(Math.abs(pointA.y - pointB.y), 2))
}

/**
 * @desc 绘制圆点
 * @param  {} pos
 */
Lock.prototype.drawPoint = function (pos) {
    this.context.beginPath();
    this.context.arc(pos.x, pos.y, this.pointRadius, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fillStyle = '#F38181';
    this.context.fill();
}


/**
 * @desc 绘制轨迹
 * @param  {} currentPos
 */
Lock.prototype.drawTrack = function (currentPos) {
    this.context.lineWidth = 4;
    this.context.strokeStyle = "#F38181";
    this.context.beginPath();
    this.track.length && this.context.moveTo(this.track[0].x, this.track[0].y);
    for (var i = 1; i < this.track.length; i++) {
        this.context.lineTo(this.track[i].x, this.track[i].y);
    }
    if (!this.isEnd) this.context.lineTo(currentPos.x, currentPos.y);
    this.context.stroke();
    this.context.closePath();
}

Lock.prototype.updateTrack = function (currentPos) {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.drawCircle();
    for (var i = 0; i < this.track.length; i++) {
        this.drawPoint(this.track[i]);
    }

    this.drawTrack(currentPos);
}

Lock.prototype.drawCircle = function () {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            this.pos[i][j] = {
                x: (i + 0.5) * this.gapX,
                y: (j + 0.5) * this.gapY,
            }
            this.context.beginPath();
            this.context.arc(this.pos[i][j].x, this.pos[i][j].y, this.radius, 0, Math.PI * 2, true);
            this.context.closePath();
            this.context.fillStyle = '#FFDE7D';
            this.context.fill();
        }
    }
}

var lock = new Lock({
    container: "lock",
    width: 300,
    height: 300
})

lock.init();