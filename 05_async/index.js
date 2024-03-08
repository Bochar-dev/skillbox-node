const { fetchAllPeoples, getPeopleHeight, removePeopleDuplicates } = require("./utils");

const searchValues = process.argv.slice(2);

if (!searchValues.length) {
  console.log("Вы не передали ни одного аргумента");
  process.exit(100);
}

(async () => {
  const results = [];

  const peoples = await fetchAllPeoples(searchValues);

  for (let i = 0; i < peoples.length; i++) {
    const searchValue = searchValues[i];
    const people = peoples[i];

    if (!people.count) {
      console.log(`No results found for ‘${searchValue}’`);
    }

    if (people.results) {
      results.push(...people.results);
    }
  }

  const filteredResults = removePeopleDuplicates(results);

  const total = filteredResults.length;

  if (!total) {
    process.exit(0);
  }

  const all = filteredResults.map((result) => result.name).join(", ");
  const minHeight = getPeopleHeight(filteredResults, "min");
  const maxHeight = getPeopleHeight(filteredResults, "max");

  console.log(`Total results: ${total}.`);
  console.log(`All: ${all}.`);
  console.log(`Min height: ${minHeight}.`);
  console.log(`Max height: ${maxHeight}.`);
})();
