import LocationForm from "./components/form";
import "./index.scss";

const LocationPage = () => {

    return (
        <div>
            <h1 className="page-title">Create new location</h1>
            <LocationForm />
        </div>
    );
}

export default LocationPage;