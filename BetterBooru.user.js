// ==UserScript==
// @name           Better Booru
// @version        0.1
// @namespace      http://tampermonkey.net/
// @description    Bigger cards, scores
// @include        http://illusioncards.booru.org/index.php?page=post&s=list*
// @grant		   none
// @require        http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

(function() {
    var pag = $('#paginator');
    pag.find('a[alt=back]').css('font-size', '4em');
    pag.find('a[alt=next]').css('font-size', '4em');

    var score_min = 0;
    var score_high = 10;

    $(`<style>
        .x-left { float: left; }
        .x-right { float: right; }
        .x-mid { width: 49.5%; }
        .x-spacer { width: 1%; }
        .x-container-div { width: 100%; height: 39px; position: relative; }
        .x-score-span { color: white; font: bold 27px/40px Helvetica, Sans-Serif; padding: 5px 12px; text-shadow: #000 0px 0px 4px; -webkit-font-smoothing: antialiased; }
        [data-icon]:before { font-family: Segoe UI Symbol; vertical-align: bottom; content: attr(data-icon); }
      </style>`).appendTo("head");

    var imgs = $('#post-list > div.content span.thumb img');
    imgs.each(function() {
        var img = $(this);
        var src = img.attr('src');
        var title = img.attr('title');

        var src_split = src.match(/thumbnails\/+(\d+)\/thumbnail_(\w+)\.(\w+)/);
        var new_img_src = '';
        if (src_split.length == 4) {
            var img_cat = src_split[1];
            var img_id = src_split[2];
            var img_type = src_split[3];
            new_img_src = '//img.booru.org/illusioncards/images/' + img_cat + '/' + img_id + '.' + img_type;
        }
        //test for img

        var score = 0;
        var score_match = title.match(/score:([0-9-]+)/);
        if (score_match.length == 2) {
            score = score_match[1];
        }

        var rating = '';
        var rating_match = title.match(/rating:(\w+)/);
        if (rating_match.length == 2) {
            rating = rating_match[1];
        }

        var parent_span = img.parents('span.thumb');
        if (score >= score_min) {
            parent_span.css({'width': 252, 'height': 391, 'margin': '0 10px 20px', 'position': 'relative'});

            var img_link = parent_span.find('a');
            var img_link_id = img_link.attr('id');
            var img_link_href = img_link.attr('href');

            //img_link.contents().unwrap();

            img.css({'max-width': '100%', 'max-height': '100%'});
            img.wrap('<div style="position: absolute; bottom: 0; right: 0;">');

            img.on('load', {
                loaded_img: img,
                loaded_score: score,
                loaded_img_src: new_img_src,
                loaded_img_link_href: img_link_href,
                loaded_img_link_id: img_link_id
            }, function(event) {
                var gray_score = Math.max(Math.min(event.data.loaded_score, score_high), 0);
                var gray_val = Math.round(187 - (gray_score * (187.0 / score_high)));
                var bgr_color = 'rgba(' + gray_val + ', 187, ' + gray_val + ', 1.0)';

                var new_html = `
                    <div class="x-container-div">
                        <a download href="` + event.data.loaded_img_src + `">
                            <div class="x-mid x-left" style="background: ` + bgr_color + `;">
                                <span data-icon="&#128190;" class="x-score-span"></span>
                            </div>
                        </a>
                        <div class="x-spacer x-left"></div>
                        <a id="` + event.data.loaded_img_link_id + `" href="` + event.data.loaded_img_link_href +`">
                            <div class="x-mid x-right" style="background: ` + bgr_color + `;">
                                <span class="x-score-span">` + event.data.loaded_score + `</span>
                            </div>
                        </a>
                    </div>`;

                event.data.loaded_img.after(new_html);
            });

            img.attr('src', new_img_src);
        }
        else {
            parent_span.remove();
        }
    });
})();

