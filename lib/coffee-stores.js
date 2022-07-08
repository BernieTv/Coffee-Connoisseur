import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
	return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&v=20220105&limit=${limit}`;
};

const getLitOfCoffeeStorePhotos = async () => {
	const photos = await unsplashApi.search.getPhotos({
		query: 'coffee shop',
		perPage: 10,
	});

	const unsplashResults = photos.response.results;
	return unsplashResults.map((result) => result.urls['small']);
};

export const fetchCoffeeStores = async () => {
	const photos = await getLitOfCoffeeStorePhotos();

	const response = await fetch(
		getUrlForCoffeeStores('43.65267326999575,-79.39545615725015', 'coffee stores', 6),
		{
			headers: {
				Authorization: process.env.FOURSQUARE_API_KEY,
			},
		}
	);
	const data = await response.json();

	return (
		data?.results?.map((venue, idx) => {
			// <------
			const neighbourhood = venue.location.neighborhood;
			return {
				id: venue.fsq_id, // <------
				address: venue.location.address || '',
				name: venue.name,
				neighbourhood:
					(neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
					venue.location.cross_street ||
					'',
				imgUrl: photos[idx],
			};
		}) || []
	);
};
