import React, { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import { getParameters, modifyQuery } from "../../utils/query";
import Articles from "../Articles/Articles";
import Authors from "../Authors/Authors";
import Form from "../Form/Form";
import { FormContext } from "../../Context/form";
import Buttons from "../Pagination/Buttons";

const limits = [3, 6, 9, 12, 15];
const getPageName = (search, buttons) =>
  getParameters(search).page || Object.keys(buttons)[0];

const getInitLimit = search => getParameters(search).limit || limits[0];

const getCurrentPage = search => +getParameters(search).pageNumber || 1;

const Search = ({ location: { search }, history }) => {
  const [data, setData] = useState();
  const [limit, setLimit] = useState(getInitLimit(search));
  const onSuccess = ({ data }) => {
    setData(data);
  };
  const { setUrl, setIsFetching } = useAxios({ onSuccess });
  useEffect(
    () => {
      const url = "/api/search" + search;
      setIsFetching(true);
      setUrl(url);
      return () => {
        setIsFetching(false);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  useEffect(
    () => {
      history.push(modifyQuery(search, { limit }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limit]
  );

  const handlePush = ({ target: { name } }) => {
    history.push(modifyQuery(search, { page: name }));
  };

  const onSubmit = values => {
    history.push(modifyQuery(search, values));
  };

  const pageName = data ? getPageName(search, data.buttons) : "";

  const main = () => {
    switch (pageName) {
      case "authors":
        return <Authors authors={data.authors || []} />;
      default:
        return <Articles articles={data.articles || []} />;
    }
  };

  const handleLimitChange = ({ target: { value } }) => {
    setLimit(value);
  };

  const getPageNumber = number => (number ? Math.ceil(number / limit) : 1);

  if (typeof data !== "object") return null;
  return (
    <>
      <div>
        {typeof data.buttons !== "object"
          ? null
          : Object.keys(data.buttons).map(name => {
              const { title, number } = data.buttons[name];
              return (
                <button
                  key={name}
                  name={name}
                  style={{
                    backgroundColor: pageName === name ? "green" : "grey"
                  }}
                  onClick={handlePush}
                >
                  {title}
                  {typeof number === "number" ? ` ${number}` : null}
                </button>
              );
            })}
      </div>
      <div>
        {Array.isArray(data.fields) ? (
          <FormContext.Provider value={{ fields: data.fields, onSubmit }}>
            <Form className="signup-form" fields={data.fields}>
              <button type="submit">Применить</button>
            </Form>
          </FormContext.Provider>
        ) : (
          "bad"
        )}
      </div>
      <select onChange={handleLimitChange} value={limit}>
        {limits.map(el => (
          <option key={el}>{el}</option>
        ))}
      </select>
      <Buttons
        pages={getPageNumber(data.buttons[pageName].number)}
        url={modifyQuery(search, { pageNumber: "" }) + "&pageNumber="}
        currentPage={getCurrentPage(search)}
      />
      {main()}
    </>
  );
};

export default Search;
