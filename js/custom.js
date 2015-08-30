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



var dsv = d3.dsv(",", "text/plain");
dsv("data/palgad.csv", function(d) {
    return {
        Asutus: d.Asutus,
        Palk: +d.Põhipalk,
        Nimi: d.Nimi,
        Tüüp: d.Tüüp,
        Ametikoht: d.Ametikoht
    }
}, function(error, rows) {
    ready(rows);
})

ready = function(nodes) {

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth,
        height = 0.9 * (w.innerHeight|| e.clientHeight|| g.clientHeight);

    nodes = nodes.filter(function(d) { return d.Tüüp == "Riigiasutus";})
    nodes = getRandomSubarray(nodes, 1000);

    asutused = d3.set(nodes.map(function(d) { return d.Asutus; })).values();

    // Create foci
    foci = {}
    foci_margin = 0.05;
    for(a in asutused) {
        asutuse_nimi = asutused[a];
        foci[asutuse_nimi] = {
            x_rel: Math.random() * (1 - 2 * foci_margin) + foci_margin,
            y_rel: Math.random() * (1 - 2 * foci_margin) + foci_margin,
        }
    }

    //var fill = d3.scale.category20b();
    var salaryDomain =  [300, 600, 1000, 2000, 6000];
    var fill = d3.scale.quantile()
        .domain(salaryDomain)
        .range(["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"].reverse()); // red-green
    //.range(["#fff7ec", "#fc8d59", "#d7301f", "#b30000", "#7f0000"]); // white-red

    var sizeScale = d3.scale.quantile()
        .domain(salaryDomain)
        .range([1, 1, 1, 2, 3]);

    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .charge(-15)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return Math.random() * width; })
        .attr("cy", function(d) { return Math.random() * width; })
        .attr("r", function(d) {return sizeScale(d.Palk)})
        .style("fill", function(d, i) { return fill(d.Palk); })
        //  .style("stroke", function(d, i) { return d3.rgb(fill(d.Palk)).darker(2); })
        .call(force.drag)
        .on("mousedown", function() { d3.event.stopPropagation(); });

    var infobar = d3.select("#infobar");

    svg
        .on("mousedown", mousedown);

    node.on("mouseenter", function(d) {
        // Asutus
        infobar.select("#asutus")
            .text(d.Asutus)
        // Ametikoht
        infobar.select("#ametikoht")
            .text(d.Ametikoht)
        // Palk
        infobar.select("#palk")
            .text(d.Palk + "€")
            .style("color", fill(d.Palk))
        // Nimi
        if(d.Nimi == "NA")
            infobar.select("#nimi").text("---")
        else
            infobar.select("#nimi").text(d.Nimi)
    })

    function tick(e) {
        var k = 1 * e.alpha;

        // Push nodes toward their designated focus.
        nodes.forEach(function(o, i) {
            focus = foci[o.Asutus]
            o.y += (focus.y_rel * height - o.y) * k;
            o.x += (focus.x_rel * width - o.x) * k;
        });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function mousedown() {
        nodes.forEach(function(o, i) {
            o.x += (Math.random() - .5) * 40;
            o.y += (Math.random() - .5) * 40;
        });
        force.resume();
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
    //window.onresize = updateWindow;
}