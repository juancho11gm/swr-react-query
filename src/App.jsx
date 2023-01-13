import { useState } from 'react';
import useSWR from 'swr';
import './App.css';

function App() {
	// return <Countries />;
	return <StarWars Page={StarWarsPage} />;
}

// In charge of returning the data. Native fetch or Axios can be used.
const fetcher = (...args) => fetch(...args).then((data) => data.json());

function StarWarsPage({ index }) {
	const { data, error, isLoading } = useSWR(
		`https://swapi.dev/api/people/?page=${index}`,
		fetcher
	);

	if (error) return <div className='centered'>Failed to load...</div>;
	if (isLoading) return <div className='centered'>Loading...</div>;

	return (
		<ul className='characters'>
			{data.results.map((item) => (
				<li key={item.name} className='character'>
					{item.name}
				</li>
			))}
		</ul>
	);
}

function StarWars({ Page }) {
	const [pageIndex, setPageIndex] = useState(1);
	return (
		<div>
			{/* We could use whatever paginated component */}
			<Page index={pageIndex} />
			{/* Because of SWR's cache, we get the benefit to preload the next page */}
			<div style={{ display: 'none' }}>
				<Page index={pageIndex + 1} />
			</div>
			<div className='button-container'>
				<button
					className='button'
					onClick={() => setPageIndex(pageIndex - 1)}
					disabled={pageIndex === 1}
				>
					Previous
				</button>
				<button className='button' onClick={() => setPageIndex(pageIndex + 1)}>
					Next
				</button>
			</div>
		</div>
	);
}

function Countries() {
	const {
		data: countries,
		error,
		isLoading,
	} = useSWR('https://restcountries.com/v3.1/all', fetcher);

	if (error) return <div>Failed to load...</div>;
	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='app'>
			<h1 className='app-title'>Countries API</h1>
			<ul className='countries'>
				{countries.map((country) => (
					<li key={country.name.common}>
						<Country country={country} />
					</li>
				))}
			</ul>
		</div>
	);
}

function Country({ country }) {
	return (
		<article class='country'>
			<figure className='country__figure'>
				<img
					className='country__image'
					alt={country.name.common}
					src={country.flags.png}
				/>
				<figcaption className='country__figcaption'>
					<h2 className='country__title'>{country.name.common}</h2>
				</figcaption>
			</figure>
		</article>
	);
}

export default App;
