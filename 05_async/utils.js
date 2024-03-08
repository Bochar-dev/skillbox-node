const axios = require("axios");

const BASE_API_URL = "https://swapi.dev/api/";
const BASE_RESOURSE = "people";
const BASE_SEARCH_PARAM = "search";

const fetchSinglePeople = async (people) => {
  const { data } = await axios.get(`${BASE_API_URL}/${BASE_RESOURSE}/?${BASE_SEARCH_PARAM}=${people}`);

  return data;
};

const fetchAllPeoples = async (peoples) => {
  try {
    const data = await Promise.all(
      peoples.map((people) =>
        fetchSinglePeople(people).catch(() => {
          console.error(`Ошибка запроса "${people}"`);
          return Promise.resolve({ count: 0 });
        })
      )
    );

    return data;
  } catch (error) {
    console.error(error);
  }
};

const getPeopleHeight = (results, type) => {
  const result = results.reduce((acc, resultItem) => {
    if (!acc.name && !acc.height) {
      return {
        name: resultItem.name,
        height: resultItem.height,
      };
    }

    if (type === "min" && Number(resultItem.height) < Number(acc.height)) {
      return {
        name: resultItem.name,
        height: resultItem.height,
      };
    }

    if (type === "max" && Number(resultItem.height) > Number(acc.height)) {
      return {
        name: resultItem.name,
        height: resultItem.height,
      };
    }

    return acc;
  }, {});

  return `${result.name}, ${result.height}cm`;
};

const removePeopleDuplicates = (peoples) => {
  const uniquePeoples = {};

  peoples.forEach((people) => {
    uniquePeoples[people.name] = people;
  });

  return Object.values(uniquePeoples);
};

module.exports = { fetchAllPeoples, fetchSinglePeople, getPeopleHeight, removePeopleDuplicates };
