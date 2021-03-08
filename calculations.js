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

    let project = [sa, aa, ca, uaw, suc, auc, cuc, uucw, tcf, ecf, effort]

    return { uucp, uaw, uucw, ecf, tcf, project };
};

module.exports = { UCP };
