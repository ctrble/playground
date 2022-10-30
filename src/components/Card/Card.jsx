import React from "react";
import useSWR from "swr";
import Image from "next/Image";

import styles from "./Card.module.scss";

function Card() {
  const { data: pokemon } = useSWR(
    "https://pokeapi.co/api/v2/pokemon/charizard"
  );

  if (!pokemon) {
    return "loading...";
  }

  // console.log(pokemon.stats);
  const { name, sprites, stats } = pokemon;

  // const getSprite = () => {
  //   return sprites.other["official-artwork"].front_default;
  // };

  // const getStat = (type) => {
  //   const stat = stats.find((element) => {
  //     console.log(element.stat.name === type);
  //     return element.stat.name === type;
  //   });
  //   return stat?.base_stat || "?";
  // };

  return (
    <>
      <h1>{name}</h1>
      <h2>base stats</h2>
      <ul>
        {stats.map((element) => {
          const name = element.stat?.name || "unknown";
          const base = element.base_stat || "?";
          return (
            <li key={`${name}-${base}`}>
              {name} : {base}
            </li>
          );
        })}
      </ul>
      <div className={styles.card__image}>
        <Image
          alt="test"
          layout="fill"
          src={sprites.other["official-artwork"].front_default}
          unoptimized={true}
        />
      </div>
    </>
  );
}

export default Card;
