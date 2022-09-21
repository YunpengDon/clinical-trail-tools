let Z_SCORE_TABLE_ALPHA = {
	"0.10": 1.26, 
	"0.05": 1.64,
	"0.025": 1.96,
	"0.0125": 2.24,
	"0.01": 2.33,
	"0.005": 2.58
}

let Z_SCORE_TABLE_BETA = {
	"0.20": 0.84,
	"0.10": 1.28,
	"0.05": 1.64,
	"0.01": 2.33
}

function change_select_proportion(){
	let ProportionsOrMeans = document.getElementById('proportion').selectedOptions[0].innerText;
	let MeansInput = document.getElementsByClassName("means-input");
	let ProportionsInput = document.getElementsByClassName("proportions-input");
	switch (ProportionsOrMeans){
		case "Proportions":
			for(i=0; i<MeansInput.length; i++){
				MeansInput[i].style.display = 'none';
			}
			
			for(i=0; i<ProportionsInput.length; i++){
				ProportionsInput[i].style.display = 'flex';
			}
			break;
		case "Means":
			for(i=0; i<MeansInput.length; i++){
				MeansInput[i].style.display = 'flex';
			}
			
			for(i=0; i<ProportionsInput.length; i++){
				ProportionsInput[i].style.display = 'none';
			}
			break;
	}
}

function change_select_type_of_trial(){
	let TypeOfTrial = document.getElementById("TrailType").selectedOptions[0].innerText;
	switch (TypeOfTrial){
		case "Non-inferior/Superior":
			document.getElementById("SuperiorityMargin_title").innerHTML = 'Non-inferiority or Superiority Margin, &#948;';
			document.getElementById("SuperiorityMarginMeans_title").innerHTML = 'Non-inferiority or Superiority Margin, &#948;';
			break;
		case "Equivalence":
			document.getElementById("SuperiorityMargin_title").innerHTML = 'Equivalence Limit, &#948;';
			document.getElementById("SuperiorityMarginMeans_title").innerHTML = 'Equivalence Limit, &#948;';
			break;
	}
}

function get_Z_score_Alpha(Alpha="0.05"){
	return Z_SCORE_TABLE_ALPHA[Alpha.toString()]
}

function get_Z_score_Beta(Beta="0.20"){
	return Z_SCORE_TABLE_BETA[Beta.toString()]
}


function fAlphaPower(Z_Alpha, Z_Power){
	return (Z_Alpha + Z_Power)**2
}


function calculate_noninferior_proportions_sample_size(Alpha="0.05", Power="0.8", p_t="0.85", p_c="0.65", delta="-0.10", k="1"){
	let Z_Alpha = get_Z_score_Alpha(Alpha);
	let Beta = (1-Power).toFixed(2);
	let Z_Power = get_Z_score_Beta(Beta);
	let Nominator = fAlphaPower(Z_Alpha, Z_Power) * (+p_c*(1-p_c) + (+p_t*(1-p_t))/k);
	let D = p_t - p_c;
	let Dominatior = (D-delta)**2;
	return Nominator/Dominatior
}

function calculate_equivalence_proportions_sample_size(Alpha="0.05", Power="0.8", p_t="0.85", p_c="0.65", delta="-0.10", k="1"){
	let Z_Alpha = get_Z_score_Alpha(Alpha)
	let Beta = ((1-Power) / 2).toFixed(2)
	let Z_Power = get_Z_score_Beta(Beta)
	let Nominator = fAlphaPower(Z_Alpha, Z_Power) * (+p_c*(1-p_c) + (+p_t*(1-p_t))/k);
	let D = Math.abs(p_t - p_c);
	let Dominatior = (D-delta)**2;
	return Nominator/Dominatior
}

function calculate_noninferior_means_sample_size(Alpha="0.05", Power="0.8", mean_t="5", mean_c="5", delta="5", sd="10", k="1"){
	let Z_Alpha = get_Z_score_Alpha(Alpha);
	let Beta = (1-Power).toFixed(2);
	let Z_Power = get_Z_score_Beta(Beta);
	let Nominator = fAlphaPower(Z_Alpha, Z_Power) * (sd**2) * (1 + 1/k);
	let D = mean_t-mean_c;
	let Dominatior = (D-delta)**2;
	return Nominator/Dominatior
}

function calculate_equivalence_means_sample_size(Alpha="0.05", Power="0.8", mean_t="5", mean_c="5", delta="5", sd="10", k="1"){
	let Z_Alpha = get_Z_score_Alpha(Alpha);
	let Beta = ((1-Power) / 2).toFixed(2);
	let Z_Power = get_Z_score_Beta(Beta);
	let Nominator = fAlphaPower(Z_Alpha, Z_Power) * (sd**2) * (1 + 1/k);
	let D = Math.abs(mean_t-mean_c);
	let Dominatior = (D-delta)**2;
	return Nominator/Dominatior
}


function SampleSizeCalculator() {
	// get values
	let ProportionsOrMeans = document.getElementById('proportion').selectedOptions[0].innerText;
	let TypeOfTrial = document.getElementById("TrailType").selectedOptions[0].innerText;
	let Alpha = document.getElementById("alpha").selectedOptions[0].innerText;
	let Power = document.getElementById("power").value;
	let TestProportion = document.getElementById("TestProportion").value;
	let ControlProportion = document.getElementById("ControlProportion").value;
	let TestMean = document.getElementById("TestMean").value;
	let ControlMean = document.getElementById("ControlMean").value;
	let StandardDeviation = document.getElementById("StandardDeviation").value;
	let SuperiorityMargin = document.getElementById("SuperiorityMargin").value;
	let SuperiorityMarginMeans = document.getElementById("SuperiorityMarginMeans").value;
	let SamplingRatio = document.getElementById("SamplingRatio").value;

	// calculate sample size
	switch (ProportionsOrMeans){
		case "Proportions":
			switch (TypeOfTrial){
				case "Non-inferior/Superior":
					sample_size_formula = calculate_noninferior_proportions_sample_size;
					break;
				case "Equivalence":
					sample_size_formula = calculate_equivalence_proportions_sample_size;
					break;
			}
			SampleSize = Math.ceil(sample_size_formula(Alpha, Power, TestProportion, ControlProportion, SuperiorityMargin, SamplingRatio));
			break;
		case 'Means':
			switch (TypeOfTrial){
				case "Non-inferior/Superior":
					sample_size_formula = calculate_noninferior_means_sample_size;
					break;
				case "Equivalence":
					sample_size_formula = calculate_equivalence_means_sample_size;
					break;
			}
			SampleSize = Math.ceil(sample_size_formula(Alpha, Power, TestMean, ControlMean, SuperiorityMarginMeans, StandardDeviation ,SamplingRatio));
			break;
			
	}
	
	// Print it out
	kSampleSize = Math.ceil(SampleSize * SamplingRatio);
	if (SampleSize<40 || kSampleSize<40){
		document.getElementById("infoSmallSampleSize").style.display = "inline";
	} else {
		document.getElementById("infoSmallSampleSize").style.display = "none";
	}
	document.getElementById("SampleSizeC").innerHTML = "n<sub>c</sub> = " + SampleSize;
	document.getElementById("SampleSizeT").innerHTML = "n<sub>t</sub> = " + kSampleSize;
}
