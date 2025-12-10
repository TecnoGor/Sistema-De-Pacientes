/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useMemo, useEffect, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-table components
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import { MenuItem } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
  showFilters,
  defaultToday,
}) {
  const defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : 10;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["5", "10", "15", "20", "25"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [medicoSeleccionado, setMedicoSeleccionado] = useState("");
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    const medicosUnicos = [...new Set(data.map((item) => item.nombresM))].filter(Boolean);
    setMedicos(medicosUnicos);
  }, [data]);

  useEffect(() => {
    if (defaultToday && !fechaDesde && !fechaHasta) {
      const today = new Date();
      const todayStr = dateToYYYYMMDD(today);
      setFechaDesde(todayStr);
      setFechaHasta(todayStr);
    }
  }, [defaultToday, fechaDesde, fechaHasta]);

  const normalizeDate = (dateString) => {
    if (!dateString) return null;

    try {
      // Si ya es una fecha en formato YYYY-MM-DD
      if (typeof dateString === "string" && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return new Date(dateString);
      }

      // Si viene con hora (formato ISO)
      const date = new Date(dateString);
      // Crear nueva fecha sin horas/minutos/segundos
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } catch (error) {
      console.error("Error normalizando fecha: ", dateString, error);
      return null;
    }
  };

  // Función para convertir Date a YYYY-MM-DD
  const dateToYYYYMMDD = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filtrar datos basados en los filtros
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) => {
      // Filtro por médic
      if (medicoSeleccionado && item.nombresM !== medicoSeleccionado) {
        return false;
      }

      // Si no hay filtros de fecha, incluir todo
      if (!fechaDesde && !fechaHasta) {
        return true;
      }

      // Normalizar la fecha de la cita
      const fechaCitaNormalizada = normalizeDate(item.fecha_cita);
      if (!fechaCitaNormalizada) return false;

      // Convertir filtros a objetos Date normalizados
      const desdeNormalizado = fechaDesde ? normalizeDate(fechaDesde) : null;
      const hastaNormalizado = fechaHasta ? normalizeDate(fechaHasta) : null;

      // Si hay fecha desde y la cita es anterior
      if (desdeNormalizado && fechaCitaNormalizada < desdeNormalizado) {
        return false;
      }

      // Si hay fecha hasta y la cita es posterior
      if (hastaNormalizado) {
        // Asegurarse de comparar solo la fecha (sin hora)
        const hastaNormalizadoEndOfDay = new Date(hastaNormalizado);
        hastaNormalizadoEndOfDay.setHours(23, 59, 59, 999);

        if (fechaCitaNormalizada > hastaNormalizadoEndOfDay) {
          return false;
        }
      }

      return true;
    });
  }, [data, medicoSeleccionado, fechaDesde, fechaHasta]);

  const limpiarFiltros = () => {
    if (defaultToday) {
      // Si está configurado para mostrar hoy por defecto, volver a hoy
      const today = new Date();
      const todayStr = dateToYYYYMMDD(today);
      setFechaDesde(todayStr);
      setFechaHasta(todayStr);
    } else {
      // Si no, limpiar completamente
      setFechaDesde("");
      setFechaHasta("");
    }
    setMedicoSeleccionado("");
  };

  const tableInstance = useTable(
    { columns, data: filteredData, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value) => setPageSize(value);

  // Render the paginations
  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

  // Customized page options starting from 1
  const customizedPageOptions = pageOptions.map((option) => option + 1);

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }) => gotoPage(Number(value.value - 1));

  // Search input value state
  const [search, setSearch] = useState(globalFilter);

  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  // Setting the entries starting point
  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      {/* Sección de Filtros */}
      {showFilters && (
        <MDBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          p={3}
          sx={{
            backgroundColor: "background.default",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <MDBox
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
            alignItems="center"
          >
            {/* Filtro por Médico */}
            <MDButton
              variant={
                fechaDesde &&
                fechaHasta &&
                fechaDesde === dateToYYYYMMDD(new Date()) &&
                fechaHasta === dateToYYYYMMDD(new Date())
                  ? "contained"
                  : "outlined"
              }
              color="info"
              onClick={() => {
                const today = new Date();
                const todayStr = dateToYYYYMMDD(today);
                setFechaDesde(todayStr);
                setFechaHasta(todayStr);
              }}
              size="small"
            >
              <Icon>today</Icon>
              &nbsp;Hoy
            </MDButton>

            <MDButton
              variant={!fechaDesde && !fechaHasta ? "contained" : "outlined"}
              color="info"
              onClick={() => {
                setFechaDesde("");
              }}
              size="small"
            >
              <Icon>calendar_view_month</Icon>
              &nbsp;Todas
            </MDButton>

            <MDBox width="15rem">
              <Autocomplete
                options={medicos}
                value={medicoSeleccionado}
                onChange={(event, newValue) => setMedicoSeleccionado(newValue || "")}
                renderInput={(params) => (
                  <MDInput {...params} label="Filtrar por médico" size="small" />
                )}
              />
            </MDBox>

            {/* Filtro por Fecha Desde */}
            <MDBox width="12rem">
              <MDInput
                type="date"
                label="Fecha desde"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                size="small"
                fullWidth
              />
            </MDBox>

            {/* Filtro por Fecha Hasta */}
            <MDBox width="12rem">
              <MDInput
                type="date"
                label="Fecha hasta"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                size="small"
                fullWidth
              />
            </MDBox>
          </MDBox>

          {/* Botón Limpiar Filtros */}
          <MDButton variant="outlined" color="secondary" onClick={limpiarFiltros} size="small">
            <Icon>clear</Icon>
            &nbsp;Limpiar
          </MDButton>
        </MDBox>
      )}

      {/* Sección de Búsqueda y Entradas por Página */}
      {entriesPerPage || canSearch ? (
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          {entriesPerPage && (
            <MDBox display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue, 10));
                }}
                size="small"
                sx={{ width: "5rem" }}
                renderInput={(params) => <MDInput {...params} />}
              />
              <MDTypography variant="caption" color="secondary">
                &nbsp;&nbsp;entries per page
              </MDTypography>
            </MDBox>
          )}
          {canSearch && (
            <MDBox width="12rem" ml="auto">
              <MDInput
                placeholder="Search..."
                value={search}
                size="small"
                fullWidth
                onChange={({ currentTarget }) => {
                  setSearch(currentTarget.value);
                  onSearchChange(currentTarget.value);
                }}
              />
            </MDBox>
          )}
        </MDBox>
      ) : null}

      {/* Tabla */}
      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableHeadCell
                  key={idx}
                  {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                  width={column.width ? column.width : "auto"}
                  align={column.align ? column.align : "left"}
                  sorted={setSortedValue(column)}
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);
            return (
              <TableRow key={key} {...row.getRowProps()}>
                {row.cells.map((cell, idx) => (
                  <DataTableBodyCell
                    key={idx}
                    noBorder={noEndBorder && rows.length - 1 === key}
                    align={cell.column.align ? cell.column.align : "left"}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </DataTableBodyCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Paginación */}
      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              Showing {entriesStart} to {entriesEnd} of {rows.length} entries
              {showFilters && (fechaDesde || fechaHasta || medicoSeleccionado) && (
                <span style={{ fontStyle: "italic", color: "#666" }}>(filtradas)</span>
              )}
            </MDTypography>
          </MDBox>
        )}
        {pageOptions.length > 1 && (
          <MDPagination
            variant={pagination.variant ? pagination.variant : "gradient"}
            color={pagination.color ? pagination.color : "info"}
          >
            {canPreviousPage && (
              <MDPagination item onClick={() => previousPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}
            {renderPagination.length > 6 ? (
              <MDBox width="5rem" mx={1}>
                <MDInput
                  inputProps={{ type: "number", min: 1, max: customizedPageOptions.length }}
                  value={customizedPageOptions[pageIndex]}
                  onChange={(handleInputPagination, handleInputPaginationValue)}
                />
              </MDBox>
            ) : (
              renderPagination
            )}
            {canNextPage && (
              <MDPagination item onClick={() => nextPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        )}
      </MDBox>
    </TableContainer>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  showFilters: false,
  defaultToday: false,
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  showFilters: PropTypes.bool,
  defaultToday: PropTypes.bool,
};

export default DataTable;
