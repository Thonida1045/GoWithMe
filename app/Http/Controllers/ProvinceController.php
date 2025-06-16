<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $provinces = Province::all();
        return response()->json($provinces);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not typically used for API controllers
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string|unique:provinces,name_en',
            'name_km' => 'required|string|unique:provinces,name_km',
        ]);

        $province = Province::create($request->all());
        return response()->json($province, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Province $province)
    {
        return response()->json($province);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Province $province)
    {
        // Not typically used for API controllers
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Province $province)
    {
        $request->validate([
            'name_en' => 'required|string|unique:provinces,name_en,' . $province->id,
            'name_km' => 'required|string|unique:provinces,name_km,' . $province->id,
        ]);

        $province->update($request->all());
        return response()->json($province);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Province $province)
    {
        $province->delete();
        return response()->json(null, 204);
    }
}