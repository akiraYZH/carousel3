class carousel {
    constructor(id) {
        this.oCarousel = $(id);
        this.oGallery = this.oCarousel.find('.gallery');
        this.oDots = this.oCarousel.find('.dots');
        this.index = 0;
        this.lastIndex = 0;
        this.nowDotIndex = 0;
        this.imgNum = 0;
        this.timer = null;
        this.domain = 'http://jianshe.bluej.cn';
        let _this = this;


        this.getImgs().then(function(data){
            // console.log(data);
            this.init(data)
        }.bind(this))

        
        

        this.oCarousel.on('mouseenter', function () {
            clearInterval(this.timer);
        }.bind(this));

        this.oCarousel.on('mouseleave', function () {
            this.timer = setInterval(() => {
                _this.index++;
                _this.turnTo(this.index);
            }, 1200)
        }.bind(this));

        this.oDots.on('click', 'li', function () {
            _this.turnTo(this.index);
        })
    }

    init(data) {
        $(data.data).each(function(index, obj){
            console.log(index, obj.ch_img_url);
            this.oGallery.append(`<li><a href="" class="img-box"><img src="${this.domain+obj.ch_img_url}" alt=""></a></li>`)
            
        }.bind(this));

        this.imgNum = this.oGallery.children().length;
        // this.oGallery.
        this.oGallery.children().each((index, obj) => {
            this.oDots.append('<li></li>').find(':first').addClass('active');
        });
        this.oDots.children().each((index, obj) => {
            obj.index = index;
        });
        let left3 = this.oGallery.children(':lt(3)').clone(true);
        let right3 = null;
        if(this.oGallery.children().length ==3){
            right3 = this.oGallery.children().clone(true);
        }else{
            right3 = this.oGallery.children(`:gt(${this.oGallery.children().length-4})`).clone(true);
        }
        // let right3 = this.oGallery.children(`:gt(${this.oGallery.children().length-4})`).clone(true);
        this.oGallery.append(left3).prepend(right3);
        this.oGallery.css('left', -this.oGallery.children().eq(0).width() * (this.index + 2))
        this.oGallery.children().eq(3).addClass('active');
        
        this.timer = setInterval(() => {
            // console.log(this);
            
            this.index++;
            this.turnTo(this.index);
        }, 1200)

    }

    turnTo(index) {
        this.index = index;
        this.oGallery.css('transition', '1s');
        this.oGallery.children().children().css('transition', '1s');
        this.oGallery.children().children().children().css('transition', '1s');
        this.oGallery.css('left', -this.oGallery.children().eq(0).width() * (this.index + 2));
        this.oGallery.children().removeClass('active').eq(this.index + 3).addClass('active');
        this.oDots.children().eq(this.lastIndex).removeClass('active');
        if (this.index > this.imgNum - 1) {
            this.nowDotIndex = 0;
        } else {
            this.nowDotIndex = this.index;
        }
        this.oDots.children().eq(this.nowDotIndex).addClass('active');
        this.lastIndex = this.nowDotIndex;
        
        
        this.oGallery.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
            
            if (this.index <= -1) {
                this.index = this.index + this.imgNum;
                this.restore();

            } else if (this.index > this.imgNum - 1) {
                this.index = this.index - this.imgNum;
                this.restore();
            }

            
        }.bind(this));
    }


    restore() {
        this.oGallery.css('transition', 'none');
        this.oGallery.css('left', -this.oGallery.children().eq(0).width() * (this.index +
            2));
        this.oGallery.children().children().css('transition', 'none');
        this.oGallery.children().removeClass('active').eq(this.index + 3).addClass(
            'active');
        this.oGallery.children().children().children().css('transition', 'none');
    }

    getImgs(){
        return $.ajax({
            "url":"http://jianshe.bluej.cn/api/index/get_carousel?postion_id=3"
        })
    }
}