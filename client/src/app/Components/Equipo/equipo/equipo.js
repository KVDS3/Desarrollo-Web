const sportSelector = document.getElementById('sportSelector');
const formations = document.querySelectorAll('.formation-container');

sportSelector.addEventListener('change', (event) => {
  formations.forEach(formation => formation.style.display = 'none');
  const selectedSport = event.target.value;
  const formation = document.getElementById(selectedSport);
  if (formation) {
    formation.style.display = 'block';
  }
});
