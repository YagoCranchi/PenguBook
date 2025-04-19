import LocationsList from "./components/list";

import "./index.scss";
const LocationPage = () => {

    return (
        <div className="locations-page">
            <h1 className="page-title">Create new location</h1>
            <LocationsList />
        </div>
    );
}

export default LocationPage;