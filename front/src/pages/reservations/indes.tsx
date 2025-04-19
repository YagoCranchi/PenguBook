import ReservationsList from "./components/list";
import "./index.scss";

const ReservationsPage = () => {
    

    return (
        <div className="reservations-page">
            <h1 className="page-title">My Reservations</h1>

            <ReservationsList />
        </div>
    );
}

export default ReservationsPage;