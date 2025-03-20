import React, { useState } from 'react';
import { Menu, IconButton } from 'react-native-paper';

interface FilterMenuProps {
    selectedFilter: string;
    setSelectedFilter: (filter: string) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ selectedFilter, setSelectedFilter }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
                <IconButton 
                    icon="filter-variant" 
                    size={24} 
                    onPress={() => setMenuVisible(true)} 
                />
            }
        >
            <Menu.Item onPress={() => setSelectedFilter('Todas las Ventas')} title="Todas las Ventas" />
            <Menu.Item onPress={() => setSelectedFilter('Mis Ventas')} title="Mis Ventas" />
            <Menu.Item onPress={() => setSelectedFilter('Más Vendidos')} title="Más Vendidos" />
            <Menu.Item onPress={() => setSelectedFilter('Menos Vendidos')} title="Menos Vendidos" />
        </Menu>
    );
};

export default FilterMenu;
