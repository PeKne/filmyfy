export const cities = [
  { name: 'Brno', code: 'BRNO'},
  { name: 'České Budějovice', code: 'CESKE_BUDEJOVICE'},
  { name: 'Hradec Králové', code: 'HRADEC_KRALOVE'},
  { name: 'Jihlava', code: 'JIHLAVA'},
  { name: 'Karlovy Vary', code: 'KARLOVY_VARY'},
  { name: 'Liberec', code: 'LIBEREC'},
  { name: "Olomouc", code: 'OLOMOUC'},
  { name: 'Ostrava', code: 'OSTRAVA'},
  { name: 'Pardubice', code: 'PARDUBICE'},
  { name: 'Plzeň', code: 'PLZEN'},
  { name: 'Praha', code: 'PRAHA'},
  { name: 'Ústí nad Labem', code: 'USTI_NAD_LABEM'},
  { name: 'Zlín', code: 'ZLIN'}
];

export const cityNameByCode = (code) => {
  return cities.find(x => x.code === code)?.name;
};
