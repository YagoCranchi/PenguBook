import ListReservations from "./components/list";

import "./index.scss";

const ListReservationsPage = () => {
    return (
        <div className="list-reservations-page">
            <h1 className="page-title">List Reservations</h1>
            <ListReservations />
        </div>
    );
}

export default ListReservationsPage;