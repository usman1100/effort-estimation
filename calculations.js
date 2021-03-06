const FloatFromString = (str) => {
    let num = parseFloat(str, 10);
    return num;
};

const UCP = (req) => {
    let { sa, aa, ca } = req;
    let { suc, auc, cuc } = req;

    sa = FloatFromString(sa);
    aa = FloatFromString(sa);
    ca = FloatFromString(ca);

    suc = FloatFromString(suc);
    auc = FloatFromString(auc);
    cuc = FloatFromString(cuc);

    //--------------------------------------------------------------

    const { t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13 } = req;

    const { e1, e2, e3, e4, e5, e6, e7, e8 } = req;

    //--------------------------------------------------------------

    let tFactors = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13];

    tFactors = tFactors.map((x) => FloatFromString(x));

    const tWeights = [
        2.0,
        1.0,
        1.0,
        1.0,
        1.0,
        0.5,
        0.5,
        2.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
    ];

    let TF = 0;

    //--------------------------------------------------------------

    let eFactors = [e1, e2, e3, e4, e5, e6, e7, e8];

    eFactors = eFactors.map((x) => FloatFromString(x));

    const eWeights = [1.5, 0.5, 1.0, 0.5, 1.0, 2.0, -1.0, -1.0];

    let EF = 0;

    //--------------------------------------------------------------

    let uaw = 1 * sa + 2 * aa + 3 * ca;
    let uucw = 5 * suc + 10 * auc + 15 * cuc;
    let uucp = uaw + uucw;

    //--------------------------------------------------------------

    for (let i = 0; i < eFactors.length; i++) EF += eFactors[i] * eWeights[i];
    for (let i = 0; i < tFactors.length; i++) TF += tFactors[i] * tWeights[i];

    let tcf = 0.6 + 0.01 * TF;
    let ecf = 1.4 + -0.03 * EF;

    let effort = (uucp * tcf * ecf) * 20;

    let projectAttributes = [sa, aa, ca, uaw, suc, auc, cuc, uucw, tcf, ecf, effort]

    let ucpDetails = { sa, aa, ca, uaw, suc, auc, cuc, uucw, tcf, ecf, effort }

    return { projectAttributes, effort, ucpDetails };
};

const eucDistance = (a, b) => {
    return a
        .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
        .reduce((sum, now) => sum + now) // sum
        ** (1 / 2)
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

const getNearestNeighbors = (target, k = 3) => {
    let data = require("./data");
    let distances = []
    for (let i = 0; i < data.length; i++) {

        let item = {
            "distance": eucDistance(target, data[i]),
            "index": i,
            "effort":data[i][10]
        }

        distances.push(item);
    }

    let sortedDistances = distances.sort(dynamicSort("distance"))

    // slicing the list from 1 to "k" + 1 because
    // 0th item in the list will have 0 distance
    // and k+1 because we want to get k items
    // but have to go one item further becuase
    // one item was skipped
    let kSmallestDistances = sortedDistances.slice(1, k + 1);

    let sum = 0;

    for (let i = 0; i < kSmallestDistances.length; i++) {
        sum += kSmallestDistances[i]["effort"];
    }

    return sum/3;

}

module.exports = { UCP, getNearestNeighbors };
