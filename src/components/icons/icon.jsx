import React from 'react';

const Icon = ({ type, className, color = 'currentColor' }) => {
  switch (type) {
    case 'dropdown':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      );
    case 'bell-alert':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
      );
    case 'archive-box':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      );
    case 'magnifying-glass':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      );
    case 'user':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      );
    case 'star':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="m9.362 9.158-5.268.584c-.19.023-.358.15-.421.343s0 .394.14.521c1.566 1.429 3.919 3.569 3.919 3.569c-.002 0-.646 3.113-1.074 5.19a.496.496 0 0 0 .734.534c1.844-1.048 4.606-2.624 4.606-2.624l4.604 2.625c.168.092.378.09.541-.029a.5.5 0 0 0 .195-.505l-1.071-5.191l3.919-3.566a.499.499 0 0 0-.28-.865c-2.108-.236-5.269-.586-5.269-.586l-2.183-4.83a.499.499 0 0 0-.909 0z" />
        </svg>
      );
    case 'star-circle-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          className={`size-6 ${className}`}
        >
          <path
            fill={color}
            fillRule="evenodd"
            d="M12 2.75a9.25 9.25 0 1 0 0 18.5a9.25 9.25 0 0 0 0-18.5M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12S17.937 22.75 12 22.75S1.25 17.937 1.25 12M12 8.9a13 13 0 0 0-.484.829l-.13.235l-.03.054c-.11.198-.257.466-.5.65c-.249.189-.548.255-.762.302l-.058.013l-.255.057c-.465.106-.755.173-.95.241c.12.181.323.42.651.803l.174.203l.04.047c.147.17.344.398.434.69c.09.29.06.589.037.817l-.006.062l-.027.271c-.047.484-.075.797-.075 1.018c.193-.068.456-.188.858-.373l.238-.11l.055-.025c.198-.093.478-.224.79-.224s.592.131.79.224l.055.026l.238.11c.402.184.665.304.858.372c0-.221-.028-.534-.075-1.018l-.027-.27l-.006-.063c-.023-.228-.053-.527.037-.817c.09-.292.287-.52.435-.69l.04-.047l.173-.203c.328-.383.53-.622.65-.803c-.194-.068-.484-.135-.95-.24l-.254-.058l-.058-.013c-.214-.047-.513-.113-.761-.302c-.244-.184-.391-.452-.5-.65l-.03-.054l-.131-.235A13 13 0 0 0 12 8.9m2.153 6.35h.002zm-4.308 0h.002zm1.038-7.365c.216-.282.568-.635 1.117-.635s.901.353 1.117.635c.207.271.42.653.651 1.067l.026.046l.13.235l.133.23l.065.017l.173.04l.255.057l.052.012c.447.101.864.195 1.179.32c.34.134.753.376.912.887c.157.503-.036.937-.23 1.246c-.183.29-.465.62-.771.978l-.208.242l-.118.14l-.057.071a5 5 0 0 0 .024.286l.03.321c.047.48.09.917.074 1.261c-.016.358-.1.838-.526 1.16c-.437.333-.926.268-1.273.168c-.325-.093-.715-.272-1.133-.465l-.049-.022l-.238-.11l-.218-.098l-.055.024l-.163.074l-.238.11l-.049.022c-.418.193-.808.372-1.133.465c-.347.1-.836.165-1.273-.168c-.426-.323-.51-.802-.526-1.16c-.016-.344.027-.781.073-1.26l.031-.322c.015-.152.022-.23.024-.286l-.057-.071l-.118-.14l-.174-.203l-.034-.039c-.306-.358-.588-.688-.77-.978c-.195-.309-.388-.743-.231-1.246c.159-.51.571-.753.912-.887c.315-.125.732-.219 1.18-.32l.051-.012l.255-.057l.239-.057l.04-.069l.091-.16l.131-.236l.026-.046c.23-.414.444-.796.651-1.067"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'bookmark':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-6 ${className}`}
        >
          <path d="M16 3H8a2 2 0 0 0-2 2v16l6-3 6 3V5a2 2 0 0 0-2-2" />
        </svg>
      );
    case 'book':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          className={`size-6 ${className}`}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
        >
          <g>
            <path d="M4 8c0-2.828 0-4.243.879-5.121C5.757 2 7.172 2 10 2h4c2.828 0 4.243 0 5.121.879C20 3.757 20 5.172 20 8v8c0 2.828 0 4.243-.879 5.121C18.243 22 16.828 22 14 22h-4c-2.828 0-4.243 0-5.121-.879C4 20.243 4 18.828 4 16z"></path>
            <path d="M19.898 16h-12c-.93 0-1.395 0-1.777.102A3 3 0 0 0 4 18.224"></path>
            <path strokeLinecap="round" d="M8 7h8m-8 3.5h5"></path>
          </g>
        </svg>
      );
    case 'clock':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <g fill="none">
            <path d="m12.593 23.258-.011.002-.071.035-.02.004-.014-.004-.071-.035q-.016-.005-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427q-.004-.016-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093q.019.005.029-.008l.004-.014-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014-.034.614q.001.018.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z" />
            <path
              fill={color}
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
            />
          </g>
        </svg>
      );
    case 'arrow-left':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 15 15"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M6.707 2.293a1 1 0 0 0-1.414 0l-4.5 4.5a1 1 0 0 0 0 1.414l4.5 4.5a1 1 0 0 0 1.414-1.414L4 8.5h9.5a1 1 0 0 0 0-2H4l2.707-2.707a1 1 0 0 0 0-1.414" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 15 15"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414" />
        </svg>
      );
    case 'bars-3':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      );
    case 'x-mark':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      );
    case 'vertical-line':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 100"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v88" />
        </svg>
      );
    case 'cart':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      );
    case 'round-dashboard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} className="size-6">
          <path
            fillRule="evenodd"
            d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'message-filled':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path
            fillRule="evenodd"
            d="M3.879 5.879C3 6.757 3 8.172 3 11v2c0 2.828 0 4.243.879 5.121C4.757 19 6.172 19 9 19h6c2.828 0 4.243 0 5.121-.879C21 17.243 21 15.828 21 13v-2c0-2.828 0-4.243-.879-5.121C19.243 5 17.828 5 15 5H9c-2.828 0-4.243 0-5.121.879m2.676 2.289a1 1 0 0 0-1.11 1.664l5.446 3.63a2 2 0 0 0 2.218 0l5.446-3.63a1 1 0 0 0-1.11-1.664L12 11.798z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'user-filled':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z" />
        </svg>
      );
    case 'swatch':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path
            fillRule="evenodd"
            d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 1 1-9 0V4.125Zm4.5 14.25a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
            clipRule="evenodd"
          />
          <path d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.09.089-.18.175-.274.257ZM12.738 17.625l6.474-6.474a1.875 1.875 0 0 0 0-2.651L15.5 4.787a1.875 1.875 0 0 0-2.651 0l-.1.099V17.25c0 .126-.003.251-.01.375Z" />
        </svg>
      );
    case 'info-rounded':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M12 17q.425 0 .713-.288T13 16v-4q0-.425-.288-.712T12 11t-.712.288T11 12v4q0 .425.288.713T12 17m0-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
        </svg>
      );
    case 'payment-solid':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path
            fillRule="evenodd"
            d="M1.5 0A1.5 1.5 0 0 0 0 1.5v6A1.5 1.5 0 0 0 1.5 9h11A1.5 1.5 0 0 0 14 7.5v-6A1.5 1.5 0 0 0 12.5 0zm6.125 1.454a.625.625 0 1 0-1.25 0v.4a1.532 1.532 0 0 0-.15 3.018l1.197.261a.39.39 0 0 1-.084.773h-.676a.39.39 0 0 1-.369-.26a.625.625 0 0 0-1.178.416c.194.55.673.965 1.26 1.069v.415a.625.625 0 1 0 1.25 0V7.13a1.641 1.641 0 0 0 .064-3.219L6.492 3.65a.281.281 0 0 1 .06-.556h.786a.39.39 0 0 1 .369.26a.625.625 0 1 0 1.178-.416a1.64 1.64 0 0 0-1.26-1.069zM2.75 3.75a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5m8.5 0a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5M4.5 9.875c.345 0 .625.28.625.625v2a.625.625 0 1 1-1.25 0v-2c0-.345.28-.625.625-.625m5.625.625a.625.625 0 1 0-1.25 0v2a.625.625 0 1 0 1.25 0zm-2.5.75a.625.625 0 1 0-1.25 0v2a.625.625 0 1 0 1.25 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'money':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M12 12.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7M10.5 16a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0"></path>
          <path d="M17.526 5.116L14.347.659L2.658 9.997L2.01 9.99V10H1.5v12h21V10h-.962l-1.914-5.599zM19.425 10H9.397l7.469-2.546l1.522-.487zM15.55 5.79L7.84 8.418l6.106-4.878zM3.5 18.169v-4.34A3 3 0 0 0 5.33 12h13.34a3 3 0 0 0 1.83 1.83v4.34A3 3 0 0 0 18.67 20H5.332A3.01 3.01 0 0 0 3.5 18.169"></path>
        </svg>
      );
    case 'faq':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={26}
          height={26}
          viewBox="0 0 26 26"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M13 0c-1.7 0-3 1.3-3 3v6c0 1.7 1.3 3 3 3h6l4 4v-4c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zm4.188 3h1.718l1.688 6h-1.5l-.407-1.5h-1.5L16.813 9H15.5zM18 4c-.1.4-.212.888-.313 1.188l-.28 1.312h1.187l-.282-1.313C18.113 4.888 18 4.4 18 4M3 10c-1.7 0-3 1.3-3 3v6c0 1.7 1.3 3 3 3v4l4-4h6c1.7 0 3-1.3 3-3v-6h-3c-1.9 0-3.406-1.3-3.906-3zm4.594 2.906c1.7 0 2.5 1.4 2.5 3c0 1.4-.481 2.288-1.281 2.688c.4.2.874.306 1.374.406l-.374 1c-.7-.2-1.426-.512-2.126-.813c-.1-.1-.275-.093-.375-.093C6.112 18.994 5 18 5 16c0-1.7.994-3.094 2.594-3.094m0 1.094c-.8 0-1.188.9-1.188 2c0 1.2.388 2 1.188 2s1.218-.9 1.218-2s-.418-2-1.218-2"></path>
        </svg>
      );
    case 'user-id-bold':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path
            fillRule="evenodd"
            d="M10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12s0 5.657-1.172 6.828S17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172S2 15.771 2 12s0-5.657 1.172-6.828S6.229 4 10 4m3.25 5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75M11 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2 8c4 0 4-.895 4-2s-1.79-2-4-2s-4 .895-4 2s0 2 4 2"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'message-question':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M20.615 4.17a4.7 4.7 0 0 0-3.33-1.38H6.705a4.71 4.71 0 0 0-4.71 4.72v6.6a4.71 4.71 0 0 0 4.71 4.72h2.34l1.94 1.94a1.34 1.34 0 0 0 1.55.32a1.1 1.1 0 0 0 .44-.3l2-2h2.34a4.73 4.73 0 0 0 3.33-1.38a4.8 4.8 0 0 0 1-1.53a4.7 4.7 0 0 0 .36-1.81v-6.6a4.7 4.7 0 0 0-1.39-3.3m-8.72 12.85a1.25 1.25 0 1 1 0-2.499a1.25 1.25 0 0 1 0 2.499m3.31-6.8a3.2 3.2 0 0 1-1.92 1.79a.65.65 0 0 0-.26.2a.6.6 0 0 0-.11.35v.57a1 1 0 1 1-2 0v-.6a2.64 2.64 0 0 1 1.69-2.41a1.22 1.22 0 0 0 .76-.68a1.2 1.2 0 0 0 .09-.49c0-.17-.038-.337-.11-.49a1.6 1.6 0 0 0-.45-.5a1.65 1.65 0 0 0-.66-.27a1.7 1.7 0 0 0-1.07.15a1.65 1.65 0 0 0-.72.76a1 1 0 1 1-1.82-.83a3.6 3.6 0 0 1 1.62-1.7a3.66 3.66 0 0 1 2.32-.35a3.51 3.51 0 0 1 2.56 1.84a3.2 3.2 0 0 1 .08 2.66"></path>
        </svg>
      );
    case 'arrow-top-right':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={21}
          height={21}
          viewBox="0 0 21 21"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-6 ${className}`}
        >
          <path d="M14.5 13.5v-7h-7m7 0l-8 8" strokeWidth={1}></path>
        </svg>
      );
    case 'sort':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={1024}
          height={1024}
          viewBox="0 0 1024 1024"
          className={`size-6 ${className}`}
        >
          <path
            fill={color}
            d="M384 96a32 32 0 0 1 64 0v786.752a32 32 0 0 1-54.592 22.656L95.936 608a32 32 0 0 1 0-45.312h.128a32 32 0 0 1 45.184 0L384 805.632zm192 45.248a32 32 0 0 1 54.592-22.592L928.064 416a32 32 0 0 1 0 45.312h-.128a32 32 0 0 1-45.184 0L640 218.496V928a32 32 0 1 1-64 0z"
          />
        </svg>
      );
    case 'sort-up':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={1024}
          height={1024}
          viewBox="0 0 1024 1024"
          className={`size-6 ${className}`}
        >
          <path
            fill={color}
            d="M384 141.248V928a32 32 0 1 0 64 0V218.56l242.688 242.688A32 32 0 1 0 736 416L438.592 118.656A32 32 0 0 0 384 141.248"
          />
        </svg>
      );
    case 'sort-down':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={1024}
          height={1024}
          viewBox="0 0 1024 1024"
          className={`size-6 ${className}`}
        >
          <path
            fill={color}
            d="M576 96v709.568L333.312 562.816A32 32 0 1 0 288 608l297.408 297.344A32 32 0 0 0 640 882.688V96a32 32 0 0 0-64 0"
          />
        </svg>
      );
    case 'plus':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M13 6a1 1 0 1 0-2 0v5H6a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5z" />
        </svg>
      );
    case 'eye':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
          />
          <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case 'eye-off':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={color}
          className={`size-6 ${className}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M10.477 10.477A3 3 0 0 0 12 15a3 3 0 0 0 2.121-.879M6.53 6.53C4.06 8.36 2.25 12 2.25 12s3.75 7.5 9.75 7.5c2.06 0 3.97-.5 5.47-1.47M17.47 17.47C19.94 15.64 21.75 12 21.75 12s-3.75-7.5-9.75-7.5c-1.06 0-2.07.13-3.03.36"
          />
        </svg>
      );
    case 'image':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={512}
          height={512}
          viewBox="0 0 512 512"
          className={`size-6 ${className}`}
          fill="none"
          stroke={color}
        >
          <rect
            width={416}
            height={352}
            x={48}
            y={80}
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth={32}
            rx={48}
            ry={48}
          ></rect>
          <circle
            cx={336}
            cy={176}
            r={32}
            fill="none"
            stroke="currentColor"
            strokeMiterlimit={10}
            strokeWidth={32}
          ></circle>
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={32}
            d="m304 335.79l-90.66-90.49a32 32 0 0 0-43.87-1.3L48 352m176 80l123.34-123.34a32 32 0 0 1 43.11-2L464 368"
          ></path>
        </svg>
      );
    case 'update':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill={color}
          className={`size-6 ${className}`}
        >
          <path d="M12 21q-1.875 0-3.512-.712t-2.85-1.925t-1.925-2.85T3 12t.713-3.512t1.924-2.85t2.85-1.925T12 3q2.05 0 3.888.875T19 6.35V4h2v6h-6V8h2.75q-1.025-1.4-2.525-2.2T12 5Q9.075 5 7.038 7.038T5 12t2.038 4.963T12 19q2.625 0 4.588-1.7T18.9 13h2.05q-.375 3.425-2.937 5.713T12 21m2.8-4.8L11 12.4V7h2v4.6l3.2 3.2z"></path>
        </svg>
      );
    case 'edit-light':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"
          ></path>
        </svg>
      );
    // Add more cases for different icons here
    default:
      return null;
  }
};

export default Icon;
