import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { styles } from '../../styles/DateRangePicker.styles';

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
    onConfirm: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, setStartDate, setEndDate, onConfirm }) => {
    const [showDateModal, setShowDateModal] = useState(false);
    const [dateType, setDateType] = useState<'start' | 'end' | null>(null);

    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString() : "Selecciona";
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            if (dateType === 'start') {
                setStartDate(selectedDate);
            } else if (dateType === 'end') {
                setEndDate(selectedDate);
            }
        }
        setDateType(null);
    };

    return (
        <View>
            {/* Icono de Calendario */}
            <TouchableOpacity onPress={() => setShowDateModal(true)} style={styles.dateIcon}>
                <MaterialIcons name="date-range" size={24} color="black" />
            </TouchableOpacity>

            {/* Modal de Selección de Fechas */}
            <Modal visible={showDateModal} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Seleccionar Rango de Fechas</Text>

                        <Button onPress={() => setDateType('start')}>
                            Fecha Inicio: {formatDate(startDate)}
                        </Button>

                        <Button onPress={() => setDateType('end')}>
                            Fecha Fin: {formatDate(endDate)}
                        </Button>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => {
                                onConfirm();
                                setShowDateModal(false); // Cierra el modal después de confirmar
                            }} style={styles.confirmButton}>
                                <AntDesign name="checkcircle" size={28} color="green" />
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => setShowDateModal(false)} style={styles.cancelButton}>
                                <AntDesign name="closecircle" size={28} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* DateTimePicker Aparece al Seleccionar */}
            {dateType !== null && (
                <DateTimePicker
                    value={dateType === 'start' ? startDate || new Date() : endDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

export default DateRangePicker;
