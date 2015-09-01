// http://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}


// Get and unzip data file
JSZipUtils.getBinaryContent('data/palgad_riik.csv.zip', function(err, data) {
    if(err) {
        throw err; // or handle err
    }

    var zip = new JSZip(data);
    csv_string = zip.file("palgad_riik.csv").asText();

    // Load data
    rowParser = function(d) {
        return {
            Asutus: d.Asutus,
            Palk: +d.Põhipalk,
            Nimi: d.Nimi,
            Tüüp: d.Tüüp,
            Ametikoht: d.Ametikoht
        }
    }

    // Parse csv
    var dsv = d3.dsv(",", "text/plain");
    var rows = dsv.parse(csv_string, rowParser)
    // Fire away
    ready(rows)
});


/*var dsv = d3.dsv(",", "text/plain");
dsv("data/palgad_riik.csv", function(d) {
    return {
        Asutus: d.Asutus,
        Palk: +d.Põhipalk,
        Nimi: d.Nimi,
        Tüüp: d.Tüüp,
        Ametikoht: d.Ametikoht
    }
}, function(error, rows) {
    ready(rows);
}*/

ready = function(nodes_all) {
    // http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    node_max_count = 1000;

    // Decrease # of nodes for mobile devices
    if(window.mobilecheck())
        node_max_count = 500;

    d3.select("#node_max_count")
        .text(node_max_count)

    var rel_height = 0.85;
    var rel_width = 0.95;

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        width = rel_width * (w.innerWidth || e.clientWidth || g.clientWidth),
        height = rel_height * (w.innerHeight|| e.clientHeight|| g.clientHeight);

    asutused = d3.set(nodes_all.map(function(d) { return d.Asutus; })).values();

    // Create foci
    foci = {}
    foci_margin = 0.1;
    for(a in asutused) {
        asutuse_nimi = asutused[a];
        foci[asutuse_nimi] = {
            x_rel: Math.random() * (1 - 2 * foci_margin) + foci_margin,
            y_rel: Math.random() * (1 - 2 * foci_margin) + foci_margin,
        }
    }

    var createPlot = function(nodes) {

        //var fill = d3.scale.category20b();
        var salaryDomain =  [300, 600, 1000, 2000, 3000];
        fillScale = d3.scale.linear()
            .domain(salaryDomain)
            .range(["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"].reverse()); // red-green
        //.range(["#fff7ec", "#fc8d59", "#d7301f", "#b30000", "#7f0000"]); // white-red

        sizeScale = d3.scale.linear()
            .domain(salaryDomain)
            .range([1, 1, 2, 3, 4]);

        force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .charge(function(d) {return - d.Palk / 1000 * 10})
            .on("tick", tick)
            .start();

        var svg = d3.select("body").select("svg")
            .attr("width", width)
            .attr("height", height)

        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "node original")
            .attr("cx", function(d) { return Math.random() * width; })
            .attr("cy", function(d) { return Math.random() * width; })
            .attr("r", function(d) {return sizeScale(d.Palk)})
            .style("fill", function(d, i) { return fillScale(d.Palk); });

        var infobar = d3.select("#infobar");

        mousedown = function() {
            nodes.forEach(function(o, i) {
                o.x += (Math.random() - .5) * 40;
                o.y += (Math.random() - .5) * 40;
            });
            force.resume();
        }

        mouseover = function(d) {
            // Asutus
            infobar.select("#asutus")
                .text(d.Asutus)
            // Ametikoht
            infobar.select("#ametikoht")
                .text(d.Ametikoht)
            // Palk
            infobar.select("#palk")
                .text(d.Palk + "€")
                .style("color", fillScale(d.Palk))
            // Nimi
            if(d.Nimi == "NA")
                infobar.select("#nimi").text("---")
            else
                infobar.select("#nimi").text(d.Nimi)
        }

        // If not on mobile, add mousedown event
        if(!window.mobilecheck())
            svg.on("mousedown", mousedown);

        svg.selectAll(".node").on("mouseenter", mouseover);

        function tick(e) {
            var k = 1 * e.alpha;

            // Push nodes toward their designated focus.
            nodes.forEach(function(o, i) {
                focus = foci[o.Asutus]
                o.y += (focus.y_rel * height - o.y) * k;
                o.x += (focus.x_rel * width - o.x) * k;
            });

            svg.selectAll(".node")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        d3.select("#asutus_filter")
            .on("change", function() {
                var filter_word = d3.event.target.value;

                // Subset nodes accordingly
                if(filter_word == "kõik")
                    nodes_new = nodes_all;
                else if(filter_word == "muud")
                    nodes_new = nodes_all.filter(function(d) {
                        return d.Asutus.indexOf("Maavalitsus") == -1 &&
                            d.Asutus.indexOf("ministeerium") == -1 &&
                            d.Asutus.indexOf("kohus") == -1;
                    })
                else
                    nodes_new = nodes_all.filter(function(d) { return d.Asutus.indexOf(filter_word) > -1; })

                // If too many nodes, sample
                if(nodes_new.length >= node_max_count)
                    nodes_new = getRandomSubarray(nodes_new, node_max_count);

                // Apply change
                //changeNodes(nodes_new);
            })

    }

    var changeClusters = function() {
        // create new foci
        // rearrange existing nodes
    }

    var changeNodes = function(nodes) {

        console.log(nodes.length + "nodes, width " + width)
        var duration = 100;

        var node = d3.select("svg").selectAll(".node")
            .data(nodes)

        node.enter()
            .append("circle")
            .attr("cx", function(d) { return Math.random() * width; })
            .attr("cy", function(d) { return Math.random() * width; })
            .attr("class", "node entered")

        node
            .style("fill", function(d) { return fillScale(d.Palk); })
            .attr("r", function(d) {return sizeScale(d.Palk)})

        node.exit()
            .remove()

        d3.selectAll(".node")
            .on("mouseenter", mouseover);

        force.resume()

    }

    function updateWindow() {
        width_old = width;
        height_old = height;

        width = w.innerWidth || e.clientWidth || g.clientWidth; // Math.min(w.innerWidth, e.clientWidth, g.clientWidth);
        height = w.innerHeight|| e.clientHeight|| g.clientHeight;


        svg.attr("width", width).attr("height", height);
        /*
         nodes.forEach(function(o, i) {
         o.y = height / height_old * o.y;
         o.x = width / width_old * o.x;
         });

         node
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });*/

        force.resume()
    }

    createPlot(getRandomSubarray(nodes_all, node_max_count));

    //window.onresize = updateWindow;
}