import { BBU_L, BBU_P, PBTBU_L, PBTBU_P, BBTB_L_024, BBTB_L_2460, BBTB_P_024, BBTB_P_2460 } from "./dataGizi.js";
import { bornConverting, heightConverting, zscoring } from "./utility.js";

const pasien = [
    {
        id: 1,
        nama: 'Fariz Ramadhan',
        lahir: '2022-07-23',
        tinggi: 95.5,
        beratBadan: 12.2,
        jenisK: 'l',
    },
    {
        id: 2,
        nama: 'Fariz Ramadhan',
        lahir: '2021-10-01',
        tinggi: 87,
        beratBadan: 12.2,
        jenisK: 'l',
    },
    {
        id: 3,
        nama: 'Fariz Ramadhan',
        lahir: '2021-08-04',
        tinggi: 88,
        beratBadan: 14,
        jenisK: 'l',
    },
]

const dataFinding = data => {
    const age = bornConverting(data.lahir);
    const height = heightConverting(data.tinggi);

    const weightOfAge = (data.jenisK === 'l') ? BBU_L.find((value) => { return value.umur === age })
        : BBU_P.find((value) => { return value.umur === age });

    const heightOfAge = (data.jenisK === 'l') ? PBTBU_L.find((value) => { return value.umur == age })
        : PBTBU_P.find((value) => { return value.umur == age });

    const weightOfHeightMale = (age < 24) ? BBTB_L_024.find((value) => { return value.tinggi == height }) 
        : BBTB_L_2460.find((value) => { return value.tinggi == height });
    
    const weightOfHeightFemale = (age < 24) ? BBTB_P_024.find((value) => { return value.tinggi == height }) 
        : BBTB_P_2460.find((value) => { return value.tinggi == height });

    const weightOfHeight = (data.jenisK === 'l') ? weightOfHeightMale : weightOfHeightFemale;
        
    return { weightOfAge, heightOfAge, weightOfHeight };
}

const sdFinding = (variable, data) => {
    if (variable > data.med) {
        if (variable < data.sdp2) {
            return data.sdp1;
        } else if (variable >= data.sdp2 && variable < data.sdp3) {
            return data.sdp2;
        } else if (variable >= data.sdp3) {
            return data.sdp3;
        }
    }

    if (variable < data.med) {
        if (variable > data.sdm2) {
            return data.sdm1;
        } else if (variable <= data.sdm2 && variable > data.sdm3) {
            return data.sdm2;
        } else if (variable <= data.sdm3) {
            return data.sdm3;
        }
    }
}

const zscore = data => {
    // Data Finding
    const dataNutrition = dataFinding(data);
    const weightOfAge = dataNutrition.weightOfAge;
    const heightOfAge = dataNutrition.heightOfAge;
    const weightOfHeight = dataNutrition.weightOfHeight;

    // Data Gathering
    const medWeightOfAge = weightOfAge.med;
    const medHeightOfAge = heightOfAge.med;
    const medWeightOfHeight = weightOfHeight.med;
    const sdWeightOfAge = sdFinding(data.beratBadan, weightOfAge);
    const sdHeightOfAge = sdFinding(data.tinggi, heightOfAge);
    const sdWeightOfHeight = sdFinding(data.beratBadan, weightOfHeight);

    // Finding denominator
    const denominatorWeightOfAge = data.beratBadan - medWeightOfAge;
    const denominatorHeightOfAge = data.tinggi - medHeightOfAge;
    const denominatorWeightOfHeight = data.beratBadan - medWeightOfHeight;

    // Finding Divider
    const dividerWeightOfAge = (sdWeightOfAge > medWeightOfAge) ? sdWeightOfAge - medWeightOfAge 
    : medWeightOfAge - sdWeightOfAge;
    const dividerHeightOfAge = (sdHeightOfAge > medHeightOfAge) ? sdHeightOfAge - medHeightOfAge 
    : medHeightOfAge - sdHeightOfAge;
    const dividerWeightOfHeight = (sdWeightOfHeight > medWeightOfHeight) ? sdWeightOfHeight - medWeightOfHeight 
    : medWeightOfHeight - sdWeightOfHeight;
    
    // Calculation
    const zscoreOfWeight = zscoring(denominatorWeightOfAge, dividerWeightOfAge);
    const zscoreOfHeight = zscoring(denominatorHeightOfAge, dividerHeightOfAge);
    const zscoreOfWeightOfHeight = zscoring(denominatorWeightOfHeight, dividerWeightOfHeight);
    return {zscoreOfWeight, zscoreOfHeight, zscoreOfWeightOfHeight};
}

const statusProfiling = data => {
    // Data Gathering
    const zScore = zscore(data);
    const sdWeightOfAge = zScore.zscoreOfWeight;
    const sdHeightOfAge = zScore.zscoreOfHeight;
    const sdWeightOfHeight = zScore.zscoreOfWeightOfHeight;

    // Data Calculation
    let BBU_Status, TBU_Status, TBBB_Status;

    if(sdWeightOfAge < -3) {
        BBU_Status = "Berat Badan Sangat Kurang"
    } else if (sdWeightOfAge >= -3 && sdWeightOfAge <= -2) {
        BBU_Status = "Berat Badan Kurang"
    } else if (sdWeightOfAge > -2 && sdWeightOfAge <= 1) {
        BBU_Status = "Berat Badan Normal"
    } else {
        BBU_Status = "Berat Badan Berlebih"
    }

    if(sdHeightOfAge < -3) {
        TBU_Status = "Sangat Pendek"
    } else if (sdHeightOfAge >= -3 && sdHeightOfAge <= -2) {
        TBU_Status = "Pendek"
    } else if (sdHeightOfAge > -2 && sdHeightOfAge <= 3) {
        TBU_Status = "Normal"
    } else {
        TBU_Status = "Tinggi"
    }

    if(sdWeightOfHeight < -3) {
        TBBB_Status = "Gizi Buruk"
    } else if(sdWeightOfHeight >= -3 && sdWeightOfHeight <= -2) {
        TBBB_Status = "Gizi Kurang"
    } else if(sdWeightOfHeight > -2 && sdWeightOfHeight <= 1) {
        TBBB_Status = "Gizi Baik (Normal)"
    } else if(sdWeightOfHeight > 1 && sdWeightOfHeight <= 2) {
        TBBB_Status = "Beresiko Gizi Lebih"
    } else if(sdWeightOfHeight > 2 && sdWeightOfHeight <= 3) {
        TBBB_Status = "Gizi Lebih"
    } else {
        TBBB_Status = "Obesitas"
    }

    return {Berat_Badan: BBU_Status, Tinggi_Badan: TBU_Status, TinggiBadan_BeratBadan: TBBB_Status};
}

console.log({
    ... pasien[2],
    status_gizi: statusProfiling(pasien[2]),
});