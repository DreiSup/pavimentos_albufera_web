# Zonas por código postal (Comunitat Valenciana)

Generado por `packages/content/scripts/build-lead-zones.ts` el 2026-10-07. No editar a mano.

## Metodología
- Zona A: CP cuyo punto representativo cae dentro del polígono (ray casting en lat/lon), más los CP forzados (municipios vértice, Vinaròs y Benicarló).
- Punto representativo de un CP: mediana de sus localidades con la mejor precisión GeoNames. Si solo tiene puntos estimados (precisión < 3), mediana de los puntos fiables de su municipio (código INE). Se descartó «si alguna localidad cae dentro, es A»: con coordenadas erróneas de GeoNames metía 03540 (Alicante) y 03550 (Sant Joan d'Alacant) en Zona A.
- Zona B: resto de CP con prefijo 03, 12, 46. Zona C: resto de España (no se lista).
- Forma del polígono: redondeada, por tiempo de coche desde Sollana. Tiempos medidos por el dueño (Google Maps): Peñíscola 105 min, Utiel 60 min, Benidorm 73 min. **Los vértices intermedios no están verificados por tiempo**; se pueden mejorar editando `LEAD_ZONE_VERTICES` y volviendo a ejecutar el script.
- `distancia_al_borde_km`: al lado más cercano del polígono; negativa si el CP está dentro. Proyección local equirrectangular.

## Fuentes y licencias
- GeoNames postal codes (ES.zip), licencia CC BY 4.0 (© GeoNames), datos "as is". Fecha de descarga: 2026-10-07. Las coordenadas pueden ser interpoladas o aproximadas: los CP cercanos al borde conviene contrastarlos con CartoCiudad (IGN, CC BY 4.0).
- Coordenadas de vértices: Peñíscola (Wikipedia), Utiel, Villena y Benidorm (distanciasentreciudades.com); resto aproximadas y contrastadas con Nominatim/OSM (ODbL) al ejecutar.
- Correos no publica base abierta; no se ha usado.

## Vértices (en orden)
| # | Vértice | lat | lon | Coordenada |
|---|---|---|---|---|
| 1 | Peñíscola | 40.35917 | 0.4075 | verificada / punto marino |
| 2 | Les Coves de Vinromà | 40.309 | 0.115 | aproximada |
| 3 | Vall d'Alba | 40.176 | -0.035 | aproximada |
| 4 | Barracas | 40.024 | -0.688 | aproximada |
| 5 | Chelva | 39.749 | -0.998 | aproximada |
| 6 | Utiel | 39.5694 | -1.20372 | verificada / punto marino |
| 7 | Venta del Moro | 39.483 | -1.355 | aproximada |
| 8 | Cofrentes | 39.233 | -1.061 | aproximada |
| 9 | Almansa | 38.869 | -1.097 | aproximada |
| 10 | Villena | 38.6318 | -0.861221 | verificada / punto marino |
| 11 | Castalla | 38.597 | -0.672 | aproximada |
| 12 | Benidorm | 38.5411 | -0.122494 | verificada / punto marino |
| 13 | Sea E of Cap de la Nau | 38.7 | 0.4 | verificada / punto marino |
| 14 | Sea E of Peñíscola | 40.359 | 0.55 | verificada / punto marino |

### Contraste con Nominatim
- Nominatim check skipped (--skip-nominatim).

## Recuento de CP
- Zona A: 455
- Zona B: 202
- Total CP Comunitat Valenciana en la fuente: 657

## Municipios a menos de 10 km del borde (negativo = dentro)
Centroide municipal = mediana de las coordenadas GeoNames fiables (precisión ≥ 3) del municipio. Un municipio fuera puede tener CP forzados a A (ver más abajo).

| Municipio | Distancia al borde (km) | Estado |
|---|---|---|
| Benissa | -9.9 | Dentro |
| Font de la Figuera, la | -9.9 | Dentro |
| Beneixama | -9.4 | Dentro |
| Sant Joan de Moró | -9.2 | Dentro |
| Campo de Mirra/Camp de Mirra, el | -9.0 | Dentro |
| Alcalà de Xivert | -8.9 | Dentro |
| Polop de Marina | -8.7 | Dentro |
| Requena | -8.6 | Dentro |
| Viver | -8.6 | Dentro |
| Bejís | -8.2 | Dentro |
| Fuentes de Ayódar | -8.1 | Dentro |
| Torás | -8.1 | Dentro |
| Espadilla | -7.7 | Dentro |
| La Nucia | -7.1 | Dentro |
| Altea | -7.0 | Dentro |
| Teulada | -7.0 | Dentro |
| Higueruelas | -6.9 | Dentro |
| Vilafamés | -5.9 | Dentro |
| Torremanzanas/Torre de les Maçanes, la | -5.7 | Dentro |
| Alcora, l' | -5.4 | Dentro |
| Calp / Calpe | -5.2 | Dentro |
| Ibi | -3.9 | Dentro |
| Calles | -3.6 | Dentro |
| Onil | -3.5 | Dentro |
| Sella | -3.3 | Dentro |
| Relleu | -3.0 | Dentro |
| Vilanova d'Alcolea | -3.0 | Dentro |
| Montán | -2.4 | Dentro |
| Cirat | -2.3 | Dentro |
| Torrechiva | -2.2 | Dentro |
| Chelva | -2.1 | Dentro |
| Teresa de Cofrentes | -1.9 | Dentro |
| Finestrat | -1.9 | Dentro |
| Ayora | -1.8 | Dentro |
| Biar | -1.6 | Dentro |
| Castellón de la Plana/Castelló de la Plana | -1.5 | Dentro |
| Castellon De La Plana/Castello De La Pla | -1.5 | Dentro |
| Benlloch | -1.4 | Dentro |
| Toro, El | -1.0 | Dentro |
| Zarra | -0.9 | Dentro |
| Sant Joan d'Alacant | -0.9 | Dentro |
| Vall d'Alba | -0.7 | Dentro |
| Cañada | -0.5 | Dentro |
| Venta del Moro | -0.2 | Dentro |
| Peníscola/Peñíscola | -0.2 | Dentro |
| Cofrentes | -0.1 | Dentro |
| Utiel | -0.0 | Dentro |
| Villena | -0.0 | Dentro |
| Useras/Useres, les | 0.0 | Fuera |
| Barracas | 0.0 | Fuera |
| Castalla | 0.1 | Fuera |
| Montanejos | 0.2 | Fuera |
| Jarafuel | 0.3 | Fuera |
| Benidorm | 0.4 | Fuera |
| Benidorm | 0.4 | Fuera |
| Ludiente | 0.5 | Fuera |
| Jalance | 0.9 | Fuera |
| Lucena del Cid | 1.6 | Fuera |
| Santa Magdalena de Pulpis | 1.6 | Fuera |
| Caudete de las Fuentes | 2.1 | Fuera |
| Torre d'en Doménec, la | 2.6 | Fuera |
| Jijona/Xixona | 2.7 | Fuera |
| Tuéjar | 3.6 | Fuera |
| Coves de Vinromà, les | 3.7 | Fuera |
| Losa del Obispo | 4.2 | Fuera |
| Fuente la Reina | 4.4 | Fuera |
| Villajoyosa | 4.5 | Fuera |
| Zucaina | 4.8 | Fuera |
| Sierra Engarcerán | 5.7 | Fuera |
| Tibi | 6.0 | Fuera |
| Aigües | 7.1 | Fuera |
| Albocàsser | 8.2 | Fuera |
| Villargordo del Cabriel | 8.7 | Fuera |
| Sax | 9.4 | Fuera |
| Fuenterrobles | 9.6 | Fuera |

## Estado de municipios clave
| Municipio | CP y zona | Distancia al borde (km) |
|---|---|---|
| Vinaròs | 12500 A (forzado) | 12.3 |
| Benicarló | 12530 A, 12580 A (forzado) | -29.2, 6.3 |
| Morella | 12300 B | 38.8 |
| Dénia | 03700 A, 03709 A, 03749 A, 03770 A, 03779 A, 03780 A | -25.7, -27.5, -11.6, -27.4, -27.5, -30.8 |
| Xàbia | 03730 A, 03737 A, 03738 A, 03739 A | -20.3, -20.3, -20.3, -20.3 |
| Calp | 03710 A | -5.2 |
| Moixent | 46640 A | -24.0 |
| Ontinyent | 46870 A | -25.4 |
| Alcoi | 03800 A, 03801 A, 03802 A, 03803 A, 03804 A, 03819 A | -14.1, -14.1, -14.1, -14.1, -14.1, -7.0 |
| Villena | 03400 A (forzado), 03408 A (forzado), 03639 A (forzado) | -0.0, -0.0, -0.0 |
| Requena | 46340 A, 46352 A, 46353 A, 46354 B, 46355 A, 46356 A, 46357 A, 46390 A, 46391 A | -12.5, -6.9, -5.7, 1.1, -7.1, -0.4, -11.4, -6.1, -8.6 |
| Chiva | 46370 A | -38.3 |
| Buñol | 46360 A | -31.2 |
| Xàtiva | 46800 A | -45.3 |
| Gandia | 46700 A, 46701 A, 46702 A, 46703 A, 46728 A, 46730 A | -45.8, -46.2, -45.8, -45.5, -47.0, -46.1 |
| Segorbe | 12400 A, 12412 A | -23.3, -25.8 |
| Castelló de la Plana | 12001 A, 12002 A, 12003 A, 12004 A, 12005 A, 12006 A, 12400 A, 12560 A | -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -23.3, -16.4 |
| Sollana | 46430 A, 46439 A | -58.8, -58.8 |

## CP forzados a Zona A
- Peñíscola: 12598
- Les Coves de Vinromà: 12185 (fuera del polígono)
- Vall d'Alba: 12190, 12193, 12194
- Barracas: 12420 (fuera del polígono)
- Chelva: 46176 (fuera del polígono), 46351
- Utiel: 46300, 46312, 46313 (fuera del polígono), 46321
- Venta del Moro: 46310 (fuera del polígono), 46311 (fuera del polígono)
- Cofrentes: 46625 (fuera del polígono)
- Villena: 03400, 03408, 03639
- Castalla: 03420 (fuera del polígono)
- Benidorm: 03500 (fuera del polígono), 03501 (fuera del polígono), 03502 (fuera del polígono), 03503 (fuera del polígono)
- Vinaròs: 12500 (fuera del polígono)
- Benicarló: 12580 (fuera del polígono)
- Almansa (vértice) es de Albacete, prefijo 02: queda en Zona C a propósito.

## CP mixtos (localidades fiables a ambos lados del borde; se clasifican por la mediana)
- 03409 (A): Las Virtudes; Cañada
- 03550 (B): Fabraquer (Ayuntamiento San Juan); Salafranca (Urbanizacion); La Font; Mezquitas, Las, F-Ii Y Iii (Urbanizacion); Rajoletes / Racholetes (Urbanizacion); Santa Faz (San Juan); Benimagrell; Huertas; Frank Espinos; Racholetes (Urbanizacion); Lloixa; Sant Joan D'Alacant
- 12123 (B): Giraba De Abajo; Castillo De Villamalefa; Giraba De Arriba; Ludiente; Cedraman
- 12184 (B): Sarratella; Torre Endomenech
- 12185 (A): Mas D'En Rieres; Coves De Vinroma, Les; Mas Dels Calduch; Mas D'En Ramona
- 12193 (A): Pelechana, La ( Pelechaneta, La); La Baseta; La Barona
- 12429 (A): Pina De Montalgrao; El Toro
- 12448 (B): Montanejos; La Alqueria
- 46176 (A): Ahillas; Chelva; Torrecilla; Ermitorio Del Remedio
- 46310 (A): Casas Del Rey; Los Marcos; Las Monjas; Venta Del Moro; Casas De Moya; Casas De Pradas
- 46313 (A): Las Casas; Los Corrales; Cuevas, Las (Utiel)
- 46621 (A): San Benito; Zarra; Casas De Madrona
- 46625 (A): Cofrentes; Hervideros De Cofrentes; Salto De Cofrentes

## CP con coordenadas solo estimadas (precisión < 3; se usa la posición fiable de su municipio)
- 03001 (B): Alicante
- 03002 (B): Alicante
- 03003 (B): Alicante
- 03004 (B): Alicante
- 03005 (B): Alicante
- 03006 (B): Alicante
- 03007 (B): Alicante
- 03008 (B): Alicante
- 03009 (B): Alicante
- 03010 (B): Alicante
- 03011 (B): Alicante
- 03012 (B): Alicante
- 03013 (B): Alicante
- 03014 (B): Alicante
- 03016 (B): Alicante
- 03071 (B): Alicante/Alacant
- 03080 (B): Alicante/Alacant
- 03138 (B): Alicante
- 03176 (B): Algorfa
- 03194 (B): Elche
- 03208 (B): Elche
- 03292 (B): Elche
- 03294 (B): Elche
- 03295 (B): Elche
- 03296 (B): Elche
- 03319 (B): Entrenaranjos / Urb. Entre Naranjos (Urbanizacion)
- 03369 (B): Orihuela
- 03408 (A): Villena
- 03459 (A): Villa-Rosa (Caserio); Casas De Maestre; Casas De Beneyto (Caserio)
- 03519 (A): Chines
- 03540 (B): Alicante
- 03559 (B): Alicante
- 03581 (A): l'Alfàs del Pi
- 03589 (A): Santa Fe (Urbanizacion)
- 03639 (A): Villena
- 03659 (B): Pinós, el/Pinoso
- 03709 (A): Dénia
- 03730 (A): Javea
- 03737 (A): Javea
- 03738 (A): Javea
- 03739 (A): Javea
- 03789 (A): Vall d'Ebo, la
- 03790 (A): Orba
- 12121 (A): Alcora, l'
- 12131 (B): Useras/Useres, les
- 12132 (B): Atzeneta del Maestrat
- 12133 (B): Atzeneta del Maestrat
- 12161 (B): Torre d'En Besora, la
- 12164 (B): Sierra Engarcerán
- 12166 (B): Sierra Engarcerán
- 12191 (A): Pobla Tornesa, la
- 12313 (B): La Pobla D'Alcolea
- 12316 (B): Hostal Nou
- 12320 (B): Sant Jordi
- 12340 (B): la Jana
- 12526 (A): La Vilavella
- 12600 (A): la Vall d'Uixó
- 46116 (A): Masias; San Isidro De Benageber
- 46127 (A): Campamento Militar De Betera
- 46137 (A): la Pobla de Farnals
- 46138 (A): Rafelbunyol/Rafelbuñol
- 46139 (A): la Pobla de Farnals
- 46143 (B): Torrebaja
- 46150 (A): Campamento De Marines
- 46184 (A): San Antonio de Benagéber
- 46225 (A): Centro Penitenciario Picassent
- 46249 (A): Villarrubia De Carlet
- 46268 (A): Alzira
- 46312 (A): Utiel
- 46321 (A): Utiel
- 46391 (A): Requena
- 46419 (A): Sueca
- 46439 (A): Sollana
- 46640 (A): Mogente/Moixent
- 46713 (A): Bellreguard
- 46717 (A): Casinos
- 46749 (A): Carcaixent
- 46759 (A): Corrales De Valldigna
- 46792 (A): Alzira
- 46815 (A): Llosa de Ranes, la
- 46819 (A): Novelé/Novetlè
- 46840 (A): Pobla del Duc, la
- 46850 (A): Olleria, l'
- 46892 (A): Montaverner
- 46901 (A): Torrent
- 46988 (A): Paterna
- 46989 (A): Paterna

## CP sin geolocalizar (clasificados B por defecto; revisar)
- Ninguno
