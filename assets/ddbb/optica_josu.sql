-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 29-10-2025 a las 22:26:14
-- Versión del servidor: 5.7.44
-- Versión de PHP: 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `optica_josu`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PRODUCT`
--

CREATE TABLE `PRODUCT` (
  `ID` int(11) NOT NULL,
  `PROVEEDOR` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FIRMA` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `REFERENCIA` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ID_PRODUCT_TYPE` int(11) NOT NULL,
  `MODELO_COLOR` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CALIBRE_PUENTE` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CANTIDAD` int(11) NOT NULL DEFAULT '1',
  `FECHA_COMPRA` date DEFAULT NULL,
  `PRECIO_COMPRA` decimal(10,2) DEFAULT NULL,
  `FECHA_VENTA` date DEFAULT NULL,
  `PRECIO_VENTA` decimal(10,2) DEFAULT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `PRODUCT`
--

INSERT INTO `PRODUCT` (`ID`, `PROVEEDOR`, `FIRMA`, `REFERENCIA`, `ID_PRODUCT_TYPE`, `MODELO_COLOR`, `CALIBRE_PUENTE`, `CANTIDAD`, `FECHA_COMPRA`, `PRECIO_COMPRA`, `FECHA_VENTA`, `PRECIO_VENTA`, `CREATED_AT`, `UPDATED_AT`) VALUES
(1, 'RAYBAN', 'FIRMAAA', 'QWE', 1, 'COLOY', '123-123-123', 1, NULL, NULL, NULL, NULL, '2025-10-29 21:13:08', '2025-10-29 21:13:08'),
(2, 'QWE', 'QWE', 'WQE', 1, 'QWE', 'QWE', 1, NULL, NULL, NULL, NULL, '2025-10-29 21:15:25', '2025-10-29 21:15:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PRODUCT_TYPE`
--

CREATE TABLE `PRODUCT_TYPE` (
  `ID` int(11) NOT NULL,
  `TYPE` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `PRODUCT_TYPE`
--

INSERT INTO `PRODUCT_TYPE` (`ID`, `TYPE`) VALUES
(1, 'Gafas Graduadas');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `PRODUCT`
--
ALTER TABLE `PRODUCT`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_PRODUCT_TYPE` (`ID_PRODUCT_TYPE`);

--
-- Indices de la tabla `PRODUCT_TYPE`
--
ALTER TABLE `PRODUCT_TYPE`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `PRODUCT`
--
ALTER TABLE `PRODUCT`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `PRODUCT_TYPE`
--
ALTER TABLE `PRODUCT_TYPE`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `PRODUCT`
--
ALTER TABLE `PRODUCT`
  ADD CONSTRAINT `FK_PRODUCT_TYPE` FOREIGN KEY (`ID_PRODUCT_TYPE`) REFERENCES `PRODUCT_TYPE` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
