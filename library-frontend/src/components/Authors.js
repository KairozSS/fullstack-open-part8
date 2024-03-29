import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries';

const Authors = ({ show, token }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const [setBirthYear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (e) => {
      const errors = e.graphQLErrors[0].message;
      console.log(errors);
    }
  });
  const res = useQuery(ALL_AUTHORS);

  if (!show) {
    return null;
  }

  if (res.loading) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    await setBirthYear({
      variables: { name, born: parseInt(born) }
    });
    setName('');
    setBorn('');
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {res.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && (
        <form onSubmit={onSubmit}>
          <h2>Set birthyear</h2>
          <div>
            name
            <select
              value={name}
              onChange={({ target }) => setName(target.value)}
            >
              <option value=""></option>
              {res.data.allAuthors.map((a) => (
                <option value={a.name} key={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button>update author</button>
        </form>
      )}
    </div>
  );
};

export default Authors;
