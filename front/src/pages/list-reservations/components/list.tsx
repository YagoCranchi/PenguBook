import { useEffect, useState } from "react";
import ListReservationsDialog from "./dialog";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import Icon from "@mdi/react";
import { mdiCog, mdiPlusBox } from "@mdi/js";
import Table from "../../../components/table";

const ListReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const axiosPrivate = useAxiosPrivate();

    const fetchReservations = async () => {
        try {
            const response = await axiosPrivate.get("/reservation/all");
            setReservations(response.data);
        } catch (error: any) {
            console.error("Error fetching users: ", error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [axiosPrivate])

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const headers = ["Location", "User", "Start Date", "End Date", "Status", "Creation Date", "Actions"];
    const data = reservations.map((reservation: any) => ({
        Location: reservation.location.name,
        User: reservation.user.name,
        "Start Date": formatDate(reservation.startDate),
        "End Date": formatDate(reservation.endDate),
        Status: reservation.status,
        "Creation Date": formatDate(reservation.creationDate),
        Actions: (
            <button
                onClick={() => handleIconClick(reservation)}
                className="icon-button"
            >
                <Icon path={mdiCog} size={1} color="currentColor" />
            </button>
        ),
    }));

    const handleIconClick = (reservation: any) => {
        setSelectedReservation(reservation);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedReservation(null);
    };

    const handleAddReservation = () => {
        setSelectedReservation(null);
        setIsDialogOpen(true);
    };

    return (
        <div className={'reservations-box ' + (reservations?.length ? '' : 'full')}>
            <button className="btn add" onClick={handleAddReservation}>
                <Icon path={mdiPlusBox} size={1} />
            </button>
            {reservations?.length ? (
                <Table
                    headers={headers}
                    data={data}
                />
            ) : (
                <p className="no-reservations">No Reservations found</p>
            )}
            <ListReservationsDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                reservation={selectedReservation}
                onUpdate={fetchReservations}
            />
        </div>

    );
}

export default ListReservations;