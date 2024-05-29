import { getCookie } from "./cookies";


export const axiosInstance = {
  baseURL: 'http://54.81.153.163:8000/api/v1',

  getData: async function (url: any) {
    const token = getCookie("jwt");
    const response = await fetch(this.baseURL + url, {
      cache: "no-cache",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      next: {
        tags: ["history"]
      }
    });
    if (!response.ok) {
      if (response.status === 403) {
        window.location.replace("/login")
      }
      let errorResponse:any = await response.json();
      alert(errorResponse.message);
      throw new Error(errorResponse.message);
    }
    return response.json();
  },

  createPost: async function (url: any, postData: any) {
    const token = getCookie("jwt");
    const response = await fetch(this.baseURL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    if (!response.ok) {
      if (response.status === 403) {
        window.location.replace("/login")
      }
      let errorResponse:any = await response.json();
      alert(errorResponse.message);
      throw new Error(errorResponse.message);
    }
    return response.json();
  },

  updateData: async function (url: any, updateData: any) {
    const token = getCookie("jwt");
    const response = await fetch(this.baseURL + url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    if (!response.ok) {
      if (response.status === 403) {
        window.location.replace("/login")
      }
      let errorResponse:any = await response.json();
      alert(errorResponse.message);
      throw new Error(errorResponse.message);
    }
    return response.json();
  },

  deleteWithData: async function (url: any, deleteData: any) {
    const token = getCookie("jwt");
    const response = await fetch(this.baseURL + url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(deleteData)
    });
    if (!response.ok) {
      if (response.status === 403) {
        window.location.replace("/login")
      }
      let errorResponse:any = await response.json();
      alert(errorResponse.message);
      throw new Error(errorResponse.message);
    }
    return response.json();
  }
};
