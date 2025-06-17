<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'image_url' => $this->image ? asset('storage/' . $this->image) : null, // ✅ Accessor from model
            'published_at' => $this->published_at,
            'category' => $this->whenLoaded('category'),
        ];
    }
}

