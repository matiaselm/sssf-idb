const fetchGraphql = async (query) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(query),
  };
  try {
    const response = await fetch('https://greeting.jelastic.metropolia.fi/graphql', options);
    const json = await response.json();
    return json.data;
  }
  catch (e) {
    console.log(e);
    return false;
  }
};

const saveGreeting = async (message) => {
  const query = {
    query: `
            mutation VariableTest($username: String!, $greeting: String!) {
              addGreeting(username: $username, greeting: $greeting) {
                username
                greeting
                time
              }
            }`,
    variables: message,
  };
  const data = await fetchGraphql(query);
  return data.addGreeting;
};

const getGreetingsByUser = async (user) => {
  const otherQuery = {
    query: `
            {
              greetingsByUser(username: "${user}"){
                id
                username
                greeting
                time
              }
            }`,
  };
  const data = await fetchGraphql(otherQuery);
  return data.greetingsByUser;
};
